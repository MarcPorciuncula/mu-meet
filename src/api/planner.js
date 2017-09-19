// @flow
import { sortBy, compose, map, toPairs, evolve } from 'ramda';
import isPlainObject from 'is-plain-object';
import parseDate from 'date-fns/parse';
import a from 'awaiting';
import firebase from './firebase';
import Functions, {
  CREATE_PLANNER_SESSION,
  GENERATE_PLANNER_RESULT,
} from './functions';

async function patch(ref, data) {
  if (isPlainObject(data) || patch instanceof Array) {
    const children = compose(
      map(([key, value]) => patch(ref.child(key), value)),
      toPairs,
    )(data);
    return await a.list(children);
  } else {
    await ref.set(patch);
  }
}

export default {
  async get(id: string) {
    const database = firebase.database();

    const session = await database
      .ref(`/sessions/${id}`)
      .once('value')
      .then(s => s.val());

    return evolve({
      config: evolve({
        searchFromDate: parseDate,
        searchToDate: parseDate,
      }),
      result: evolve({
        meetings: map(
          evolve({
            end: parseDate,
            start: parseDate,
          }),
        ),
      }),
    })(session);
  },
  async update(id: string, data: any) {
    const database = firebase.database();

    const session = database.ref(`/sessions/${id}`);
    await patch(session, data);
  },
  async forUser(uid: string): Promise<Array<string>> {
    const database = firebase.database();

    const sessionsMap = await database
      .ref(`/users/${uid}/previous-sessions`)
      .once('value')
      .then(s => s.val());

    const sessions = compose(
      map(([key, id]) => id),
      sortBy(([key]) => key),
      toPairs,
    )(sessionsMap);

    const current = await database
      .ref(`/users/${uid}/current-session`)
      .once('value')
      .then(s => s.val());
    if (current) {
      sessions.push(current);
    }

    return sessions;
  },
  async create() {
    const date = new Date();
    await Functions.call(CREATE_PLANNER_SESSION, {
      data: {
        startedAt: date.toString(),
        timezoneOffset: date.getTimezoneOffset(),
      },
    });
  },
  async join({ uid, id }: { uid: string, id: string }) {
    const database = firebase.database();

    // Check if the session exists using the public startedAt field
    const exists = await database
      .ref(`/sessions/${id}/startedAt`)
      .once('value')
      .then(s => s.val());
    if (!exists) {
      throw new Error(`session ${id} does not exist.`);
    }

    // Place the user into the session and set the current session.
    await database.ref(`/sessions/${id}/users/${uid}`).set(true);
    await database.ref(`/users/${uid}/current-session`).set(id);
  },
  async archive({ uid, id }: { uid: string, id: string }) {
    const database = firebase.database();

    await database.ref(`/users/${uid}/current-session`).set(null);
    await database.ref(`/users/${uid}/previous-sessions`).push(id);
  },
  async result(id: string) {
    // HACK this only works if the session is the current user's current session.

    await Functions.call(GENERATE_PLANNER_RESULT);
    return (await this.get(id)).result;
  },
};
