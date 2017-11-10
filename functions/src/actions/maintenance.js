import admin from 'firebase-admin';
import parseDate from 'date-fns/parse';
import isBefore from 'date-fns/is_before';
import addDays from 'date-fns/add_days';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import a from 'awaiting';
import { evolve } from 'ramda';
import { fetchProfileIntoDatabase } from './users';

const BATCH_SIZE = 20;
const CONCURRENT_CONNECTIONS = 6;

export async function deleteOldSessions() {
  const database = admin.database();

  console.log('Beginning maintenance [CLEAR_OLD_SESSIONS].');
  const maxAgeDays = 14;
  const now = new Date();
  const deleteUntil = addDays(now, -1 * maxAgeDays);
  const paths = [];

  console.log(
    'Tag all sessions since',
    deleteUntil,
    `(${maxAgeDays} days old)`,
    'for deletion.',
  );
  await batchMapRef(database.ref('/sessions'), BATCH_SIZE, (data, key) => {
    const session = evolve({ startedAt: parseDate })(data);
    if (isBefore(session.startedAt, deleteUntil)) {
      paths.push(`/sessions/${key}`);
      console.log(
        '-',
        `/sessions/${key}`,
        `(${getDistanceInWordsStrict(session.startedAt, now, {
          unit: 'd',
        })} old)`,
      );
    }
  });

  console.log(
    "Tag sessions that will be deleted from users' previous sessions.",
  );
  await batchMapRef(database.ref(`/users`), BATCH_SIZE, (user, uid) => {
    const sessions = user['previous-sessions'];
    for (const key in sessions) {
      const sessionKey = sessions[key];
      if (paths.includes(`/sessions/${sessionKey}`)) {
        paths.push(`/users/${uid}/previous-sessions/${key}`);
        console.log('-', `/users/${uid}/previous-sessions/${key}`);
      }
    }
    const current = user['current-session'];
    if (current && paths.includes(`/sessions/${current}`)) {
      paths.push(`/users/${uid}/current-session`);
      console.log('-', `/users/${uid}/current-session`);
    }
  });

  await a.map(paths, CONCURRENT_CONNECTIONS, async path => {
    await database.ref(path).set(null);
    console.log('Delete', `${path}.`);
  });
  console.log('Committed', paths.length, 'deletions.');

  console.log('Maintenance [CLEAR_OLD_SESSIONS] successful.');
}

export async function refetchProfiles() {
  const database = admin.database();

  console.log('Beginning maintenance [REFETCH_PROFILES]');
  await batchMapRef(database.ref(`/users`), BATCH_SIZE, (user, uid) =>
    fetchProfileIntoDatabase({ data: { uid: uid } }),
  );
  console.log('Maintenance [REFETCH_PROFILES] successful.');
}

export async function validateUsers() {
  const database = admin.database();

  console.log('Beginnning maintenance [VALIDATE_USERS]');
  await batchMapRef(database.ref('/users'), BATCH_SIZE, (user, uid) => {
    console.log('User', uid);
    if (!user.profile) console.log('NO_PROFILE');
    if (!user.tokens) console.log('NO_TOKENS');
    if (user.tokens && !user.tokens.refresh_token)
      console.log('NO_REFRESH_TOKEN');
  });
  console.log('Maintenance [VALIDATE_USERS] successful');
}

async function batchMapRef(ref, size, cb) {
  const result = [];

  let data = await ref
    .orderByKey()
    .limitToFirst(1)
    .once('value')
    .then(s => s.val());
  let keys = data ? Object.keys(data) : [];

  while (keys.length) {
    result.push(
      ...(await Promise.all(keys.map(async key => cb(data[key], key)))),
    );
    data = await ref
      .orderByKey()
      .startAt(keys[keys.length - 1])
      .limitToFirst(size)
      .once('value')
      .then(s => s.val());
    // startAt querys are inclusive, we don't want to double process the last key, so
    // start at the second
    keys = Object.keys(data).slice(1);
  }

  return result;
}
