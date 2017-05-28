import shortid from 'shortid';
import a from 'awaiting';
import admin from 'firebase-admin';
import R from 'ramda';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import parseDate from 'date-fns/parse';
import { getOAuth2Client } from '../auth/google-oauth';
import { fetchEvents } from '../calendar/google-calendar';
import addMinutes from 'date-fns/add_minutes';
import isBefore from 'date-fns/is_before';
import isEqual from 'date-fns/is_equal';

const SESSION_ERROR_CODES = {
  ALREADY_IN_SESSION: 'session/already-in-session',
};

export class SessionError extends Error {
  static get codes() {
    return SESSION_ERROR_CODES;
  }
  constructor(code, message) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

const PHASE_LOBBY = 'PHASE_LOBBY';

const DEFAULT_STATE = {
  host: null,
  phase: PHASE_LOBBY,
  users: {},
  config: {
    minDuration: 1,
    searchFromDate: null,
    searchToDate: null,
    searchFromHour: 9,
    searchToHour: 18,
    days: {
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    },
  },
  result: {
    pending: false,
    meetings: [],
  },
};

/**
 * Creates a new session and sets the host to the supplied user
 * @param  {string} hostId
 */
export async function createSession(hostId) {
  const database = admin.database();

  const host = await database
    .ref(`/users/${hostId}`)
    .once('value')
    .then(snapshot => snapshot.val());

  if (host.currentSession) {
    throw new SessionError(
      SessionError.codes.ALREADY_IN_SESSION,
      `User ${hostId} tried to create a new session, but is already in one.`,
    );
  }

  const sessionId = shortid.generate();

  const session = Object.assign({}, DEFAULT_STATE, {
    host: hostId,
    config: Object.assign({}, DEFAULT_STATE.config, {
      searchFromDate: getStartOfWeek(new Date()),
      searchToDate: getEndOfWeek(new Date()),
    }),
    users: {
      [hostId]: { ready: false },
    },
  });

  await a.list([
    database
      .ref(`/sessions/${sessionId}`)
      .set(R.evolve({ config: serializeConfig })(session)),
    database.ref(`/users/${hostId}/current-session`).set(sessionId),
  ]);
}

export async function findMeetingTimes(sessionId) {
  const database = admin.database();

  const sessionRef = database.ref(`/sessions/${sessionId}`);

  const uids = await sessionRef
    .child(`users`)
    .once('value')
    .then(s => s.val())
    .then(R.keys);

  const config = await sessionRef
    .child('config')
    .once('value')
    .then(s => s.val())
    .then(hydrateConfig);

  await sessionRef.child('result/pending').set(true);
  await sessionRef.child('phase').set('PHASE_RESULT');

  // FIXME don't do this serially
  const events = [];
  for (let uid of uids) {
    let { save, oAuth2Client } = await getOAuth2Client(uid);
    const calendarIds = await database
      .ref(`/users/${uid}/selected-calendars`)
      .once('value')
      .then(s => s.val())
      .then(R.compose(R.map(atob), R.keys, R.pickBy(R.identity)));

    for (let calendarId of calendarIds) {
      events.splice(
        events.length,
        ...(await fetchEvents(uid, oAuth2Client, {
          from: config.searchFromDate,
          to: config.searchToDate,
          calendarId,
        })),
      );
    }

    save();
  }

  console.log(
    `Fetched ${events.length} events from ${config.searchFromDate.toISOString()} to ${config.searchToDate.toISOString()}`,
  );

  // TODO restrict days, hours
  // TODO prioritise
  const meetings = R.compose(
    R.reduce((arr, interval) => {
      if (arr.length === 0) {
        return [{ start: interval, duration: 30 }];
      }
      const last = arr[arr.length - 1];
      if (isEqual(addMinutes(last.start, last.duration), interval)) {
        last.duration = last.duration + 30;
        return arr;
      } else {
        return [...arr, { start: interval, duration: 30 }];
      }
    }, []),
    intervals => {
      const candidates = R.fromPairs(
        R.map(interval => [interval.toISOString(), true], intervals),
      );
      for (const event of events) {
        const spannedIntervals = getSpannedIntervals(
          30,
          parseDate(event.start.dateTime),
          parseDate(event.end.dateTime),
          config.searchFromDate,
        );
        for (const interval of spannedIntervals) {
          candidates[interval.toISOString()] = false;
        }
      }
      return R.compose(R.map(parseDate), R.keys, R.pickBy(R.identity))(
        candidates,
      );
    },
  )(getIntervals(30, config.searchFromDate, config.searchToDate));

  await sessionRef
    .child('result/meetings')
    .set(
      meetings.map(({ start, duration }) => ({
        start: start.toISOString(),
        duration,
      })),
    );
  await sessionRef.child('result/pending').set(false);
}

function hydrateConfig(config) {
  return R.evolve({
    searchFromDate: parseDate,
    searchToDate: parseDate,
  })(config);
}

function serializeConfig(config) {
  return R.evolve({
    searchFromDate: toISOString,
    searchToDate: toISOString,
  })(config);
}

function toISOString(date) {
  return date.toISOString();
}

function atob(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}

// function btoa(raw) {
//   return new Buffer(raw).toString('base64');
// }

/**
 * Finds the start datetimes of slots of duration from the start date to the end date
 * @param  {number} duration duration of intervals in minutes
 * @return {Array<Date>} datetimes of interval starts
 */
export function getIntervals(duration, from, to) {
  const intervals = [];

  let current = from;
  while (isBefore(current, to)) {
    intervals.push(current);
    current = addMinutes(current, duration);
  }

  return intervals;
}

function getSpannedIntervals(duration, start, end, from) {
  const intervals = [];

  let current = from;
  while (isBefore(current, start)) {
    current = addMinutes(current, duration);
  }

  while (isBefore(current, end)) {
    intervals.push(current);
    current = addMinutes(current, duration);
  }

  return intervals;
}
