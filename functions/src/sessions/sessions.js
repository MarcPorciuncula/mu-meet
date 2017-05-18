import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import shortid from 'shortid';
import a from 'awaiting';
import admin from 'firebase-admin';

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
    searchFromDate: getStartOfWeek(new Date()).toISOString(),
    searchToDate: getEndOfWeek(new Date()).toISOString(),
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
  await a.list([
    database.ref(`/sessions/${sessionId}`).set(
      Object.assign({}, DEFAULT_STATE, {
        host: hostId,
        users: {
          [hostId]: { ready: false },
        },
      }),
    ),
    database.ref(`/users/${hostId}/currentSession`).set(sessionId),
  ]);
}
