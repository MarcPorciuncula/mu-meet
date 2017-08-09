import shortid from 'shortid';
import a from 'awaiting';
import admin from 'firebase-admin';
import R from 'ramda';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import parseDate from 'date-fns/parse';
import oauth from '../auth/oauth-manager';
import { fetchEvents } from '../calendar/google-calendar';
import addMinutes from 'date-fns/add_minutes';
import {
  Timeslot,
  getAvailableTimeslots,
  getWeekdaysOverRange,
} from './timeslot';
import getDifferenceInMinutes from 'date-fns/difference_in_minutes';
import addHours from 'date-fns/add_hours';
import isBefore from 'date-fns/is_before';
import getDay from 'date-fns/get_day';

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

const DEFAULT_STATE = {
  host: null,
  users: {},
  startedAt: null,
  config: {
    minDuration: 1,
    searchFromDate: null,
    searchToDate: null,
    searchFromHour: 9,
    searchToHour: 18,
    days: [false, true, true, true, true, true, false],
  },
  result: {
    status: false,
    stale: true,
    meetings: [],
  },
};

/**
 * Creates a new session and sets the host to the supplied user
 * @param  {string} hostId
 */
export async function createSession(hostId, { startedAt, timezoneOffset }) {
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
    startedAt: parseDate(startedAt),
    config: Object.assign({}, DEFAULT_STATE.config, {
      searchFromDate: addMinutes(
        getStartOfWeek(parseDate(startedAt)),
        timezoneOffset,
      ),
      searchToDate: addMinutes(
        getEndOfWeek(parseDate(startedAt)),
        timezoneOffset,
      ),
      timezoneOffset,
    }),
    users: {
      [hostId]: { subscribed: false },
    },
  });

  await a.list([
    database.ref(`/sessions/${sessionId}`).set(serializeSession(session)),
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

  await sessionRef.child('result/status').set('FETCH_SCHEDULES');

  try {
    const fetchUserEventsInRange = async uid => {
      const client = await oauth.getClient(uid);

      const calendarIds = await database
        .ref(`/users/${uid}/selected-calendars`)
        .once('value')
        .then(s => s.val())
        .then(R.compose(R.map(atob), R.keys, R.pickBy(R.identity)));

      const fetchCalendarEventsInRange = calendarId =>
        fetchEvents(uid, client, {
          from: config.searchFromDate,
          to: config.searchToDate,
          calendarId,
        });

      const userEvents = R.flatten(
        await a.list(calendarIds.map(fetchCalendarEventsInRange)),
      );

      return userEvents;
    };

    const allUserEvents = R.flatten(
      await a.list(uids.map(uid => fetchUserEventsInRange(uid))),
    );

    console.log(
      `Fetched ${allUserEvents.length} events from ${config.searchFromDate.toString()} to ${config.searchToDate.toString()}`,
    );

    await sessionRef.child('result/status').set('RESOLVE_TIMES');

    const parseEventToTimeslot = event =>
      new Timeslot(
        parseDate(event.start.dateTime),
        getDifferenceInMinutes(
          parseDate(event.end.dateTime),
          parseDate(event.start.dateTime),
        ),
      );

    const allUserEventTimeslots = allUserEvents.map(parseEventToTimeslot);

    console.log(allUserEventTimeslots.map(x => x.toJSON()));

    const restrictedHours = [];
    for (const date of dateRange(
      config.searchFromDate,
      config.searchToDate,
      24,
    )) {
      restrictedHours.push(new Timeslot(date, config.searchFromHour * 60));
      restrictedHours.push(
        new Timeslot(
          addMinutes(date, config.searchToHour * 60),
          (24 - config.searchToHour) * 60,
        ),
      );
    }

    const restrictedDays = getWeekdaysOverRange(
      Timeslot.fromRange(config.searchFromDate, config.searchToDate),
      config.days.map(day => !day),
    );

    // const restrictedDays = [];
    // for (const date of dateRange(
    //   config.searchFromDate,
    //   config.searchToDate,
    //   24,
    // )) {
    //   if (!config.days[getDay(addMinutes(date, -config.timezoneOffset))]) {
    //     restrictedDays.push(new Timeslot(date, 60 * 24));
    //   }
    // }

    const range = Timeslot.fromRange(
      config.searchFromDate,
      config.searchToDate,
    );
    const meetings = Timeslot.accumulate(
      getAvailableTimeslots(
        range,
        R.flatten([allUserEventTimeslots, restrictedHours, restrictedDays]),
        30,
      ),
    );

    // TODO prioritise

    await sessionRef
      .child('result/meetings')
      .set(meetings.map(timeslot => timeslot.toJSON()));
    await sessionRef.child('result/status').set('DONE');
    await sessionRef.child('result/stale').set(false);
  } catch (err) {
    await sessionRef.child('result/status').set(false);
    await sessionRef.child('result/stale').set(true);
    throw err;
  }
}

// function hydrateSession(session) {
//   return R.evolve({
//     startedAt: parseDate,
//     config: hydrateConfig,
//   })(session);
// }

function serializeSession(session) {
  return R.evolve({
    startedAt: toString,
    config: serializeConfig,
  })(session);
}

function hydrateConfig(config) {
  return R.evolve({
    searchFromDate: parseDate,
    searchToDate: parseDate,
  })(config);
}

function serializeConfig(config) {
  return R.evolve({
    searchFromDate: toString,
    searchToDate: toString,
  })(config);
}

function toString(date) {
  return date.toString();
}

function atob(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}

function dateRange(from, to, interval /* hours */) {
  const result = [];
  let current = from;
  while (isBefore(current, to)) {
    result.push(current);
    current = addHours(current, to);
  }
  return result;
}

// function btoa(raw) {
//   return new Buffer(raw).toString('base64');
// }
