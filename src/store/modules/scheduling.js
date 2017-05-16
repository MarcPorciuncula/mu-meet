import * as firebase from 'firebase';
import R from 'ramda';
import parseDate from 'date-fns/parse';
import getDay from 'date-fns/get_day';
import {
  getFreeHalfHourIntervals,
  restrictHours,
  groupIntervals,
  sortByDistanceFrom1PM,
} from '@/scheduler';
import invariant from 'invariant';
import axios from 'axios';

export const PHASE_LOBBY = 'PHASE_LOBBY';
export const PHASE_CONFIGURE = 'PHASE_CONFIGURE';
export const PHASE_RESULT = 'PHASE_RESULT';
export const PHASE_ARCHIVED = 'PHASE_ARCHIVED';

const SUBSCRIBED_SESSION_FIELDS = [
  'host',
  'users',
  'config',
  'result',
  'phase',
];

export default {
  state: {
    isInSession: false,
    sessionPending: false,
    session: {
      isHost: false,
      id: null,
      phase: null,
      host: null,
      users: {},
      config: {},
      result: {
        pending: false,
        meetings: [],
      },
    },
    subscription: {
      isSubscribed: false,
      dispose: null,
    },
  },
  mutations: {
    updateSchedulingSessionStatus,
    updateSchedulingSession,
    updateSchedulingSessionSubscription,
  },
  actions: {
    refreshSchedulingSessionStatus,
    subscribeSchedulingSessionStatus,
    createSchedulingSession,
    joinSchedulingSession,
    advanceToConfigurePhase,
    advanceToResultPhase,
    returnToLobbyPhase,
    uploadEvents,
    disposeSession,
  },
};

function updateSchedulingSessionStatus(state, data) {
  invariant(
    data && typeof data === 'object',
    'Must supply data object to updateSchedulingSessionStatus',
  );
  Object.assign(state, R.pick(['isInSession', 'sessionPending'], data));
}

function updateSchedulingSession(state, data) {
  invariant(
    typeof data === 'object',
    'Must supply data object to updateSchedulingSession',
  );
  if (data === null) {
    state.session = {
      isHost: false,
      id: null,
      phase: null,
      host: null,
      users: {},
      config: {},
      result: {},
    };
  } else {
    Object.assign(
      state.session,
      R.pick(['isHost', 'id', ...SUBSCRIBED_SESSION_FIELDS], data),
    );
  }
}

function updateSchedulingSessionSubscription(state, data) {
  invariant(
    data && typeof data === 'object',
    'Must supply data object to updateSchedulingSessionSubscription',
  );
  Object.assign(state.subscription, R.pick(['isSubscribed', 'dispose'], data));
}

async function refreshSchedulingSessionStatus({ commit, rootState }) {
  try {
    invariant(
      rootState.auth.isSignedIn,
      'Must be signed in before calling refreshSchedulingSessionStatus',
    );
  } catch (err) {
    commit('updateSchedulingSessionStatus', {
      isInSession: false,
      sessionPending: false,
    });
    throw err;
  }
  commit('updateSchedulingSessionStatus', {
    isInSession: false,
    sessionPending: true,
  });
  const uid = rootState.auth.uid;
  const database = firebase.database();
  const snapshot = await database
    .ref(`/users/${uid}/currentSession`)
    .once('value');
  const sessionId = snapshot.val();
  if (sessionId) {
    const snapshot = await database.ref(`/sessions/${sessionId}`).once('value');
    const sessionData = snapshot.val();
    commit('updateSchedulingSessionStatus', {
      isInSession: true,
      sessionPending: false,
    });
    commit(
      'updateSchedulingSession',
      Object.assign(
        {
          isHost: uid === sessionData.host,
          id: sessionId,
        },
        R.pick(SUBSCRIBED_SESSION_FIELDS, sessionData),
      ),
    );
  } else {
    commit('updateSchedulingSessionStatus', {
      isInSession: false,
      sessionPending: false,
    });
    commit('updateSchedulingSession', null);
  }
}

async function subscribeSchedulingSessionStatus({ commit, state, rootState }) {
  invariant(
    state.isInSession,
    'Must be in session to call subscribeSchedulingSessionStatus',
  );
  const database = firebase.database();

  let _resolve;
  const initial = new Promise(resolve => {
    _resolve = resolve;
  });

  const dispose = database
    .ref(`/sessions/${state.session.id}`)
    .on('value', async snapshot => {
      if (_resolve) {
        _resolve();
        _resolve = null;
      }
      const sessionData = snapshot.val();
      if (sessionData === null) {
        dispose();
      }
      commit(
        'updateSchedulingSession',
        Object.assign(
          {
            isHost: sessionData && sessionData.host === rootState.auth.uid,
          },
          R.pick(SUBSCRIBED_SESSION_FIELDS, sessionData),
        ),
      );
    });

  commit('updateSchedulingSessionSubscription', {
    isSubscribed: true,
    dispose,
  });

  await initial;
}

async function createSchedulingSession({ commit, state, rootState }) {
  invariant(
    rootState.auth.isSignedIn,
    'Must be signed in to call createSchedulingSession',
  );
  const firebaseToken = await firebase.auth().currentUser.getToken(true);
  const res = await axios({
    url: 'https://us-central1-meetingsync-f62e3.cloudfunctions.net/createSession',
    method: 'post',
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
  console.log('Cloud function response', res);
}

async function joinSchedulingSession({ commit, state, rootState }, sessionId) {
  invariant(
    rootState.auth.isSignedIn,
    'Must be signed in to call joinSchedulingSession',
  );
  invariant(
    !state.isInSession,
    'Must not be in session to call joinSchedulingSession',
  );
  invariant(sessionId, 'Must supply session id to joinSchedulingSession');
  const database = firebase.database();

  const sessionRef = database.ref(`/sessions/${sessionId}`);
  const snapshot = await sessionRef.once('value');
  const sessionData = snapshot.val();
  if (!sessionData) {
    throw new Error(`Session ${sessionId} does not exist`);
  }

  await sessionRef.child(`users/${rootState.auth.uid}/ready`).set(false);
  await database
    .ref(`/users/${rootState.auth.uid}/currentSession`)
    .set(sessionId);
}

async function advanceToConfigurePhase({ commit, state }) {
  invariant(
    state.isInSession,
    'Must be in session to call advanceToConfigurePhase',
  );
  invariant(
    state.session.isHost,
    'Must not call advanceToConfigurePhase if not host',
  );
  invariant(
    state.session.phase === PHASE_LOBBY,
    'Must be in lobby phase to call advanceToConfigurePhase',
  );

  const database = firebase.database();
  await database
    .ref(`/sessions/${state.session.id}/phase`)
    .set(PHASE_CONFIGURE);
}

async function advanceToResultPhase({ commit, state }) {
  invariant(
    state.isInSession,
    'Must be in session to call advanceToResultPhase',
  );
  invariant(
    state.session.isHost,
    'Must not call advanceToResultPhase if not host',
  );
  invariant(
    state.session.phase === PHASE_CONFIGURE,
    'Must be in configure phase to call advanceToResultPhase',
  );

  // TODO move this into a cloud function

  const database = firebase.database();
  const sessionRef = database.ref(`/sessions/${state.session.id}`);
  await Promise.all([
    sessionRef.child('phase').set(PHASE_RESULT),
    sessionRef.child('result/pending').set(true),
  ]);

  const usersRef = sessionRef.child('users');

  const users = await new Promise(resolve => {
    const handler = usersRef.on('value', snapshot => {
      const value = snapshot.val();
      if (Object.values(value).every(user => user.ready)) {
        usersRef.off('value', handler);
        resolve(value);
      }
    });
  });

  const combinedEvents = R.compose(
    R.map(event => ({
      start: parseDate(event.start.dateTime),
      end: parseDate(event.end.dateTime),
    })),
    R.filter(R.identity),
    R.flatten,
    R.map(R.prop('events')),
    R.values,
  )(users);

  const decodeDay = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  const freeIntervals = R.compose(
    R.sort((a, b) => sortByDistanceFrom1PM(a.start, b.start)),
    groupIntervals,
    R.filter(
      datetime => state.session.config.days[decodeDay[getDay(datetime)]],
    ),
    R.filter(
      restrictHours(
        state.session.config.searchFromHour,
        state.session.config.searchToHour,
      ),
    ),
    getFreeHalfHourIntervals,
  )(combinedEvents);

  await sessionRef.child('result/meetings').set(
    freeIntervals.map(({ start, duration }) => ({
      start: start.toISOString(),
      duration,
    })),
  );
  await sessionRef.child('result/pending').set(false);
}

async function returnToLobbyPhase({ commit, state }) {
  invariant(state.isInSession, 'Must be in session to call returnToLobbyPhase');
  invariant(
    state.session.isHost,
    'Must not call returnToLobbyPhase if not host',
  );
  invariant(
    state.session.phase !== PHASE_CONFIGURE,
    'Must not be in configure phase to call returnToLobbyPhase',
  );

  const database = firebase.database();
  const sessionRef = database.ref(`/sessions/${state.session.id}`);
  await Promise.all([
    sessionRef.child('result/meetings').set(null),
    sessionRef.child('phase').set(PHASE_LOBBY),
    ...Object.keys(state.session.users).map(uid =>
      sessionRef.child(`/users/${uid}`).set({ ready: false }),
    ),
  ]);
}

async function uploadEvents({ commit, rootState, state }) {
  invariant(state.isInSession, 'Must be in session to call uploadEvents');
  invariant(
    state.session.phase === PHASE_RESULT,
    'Must be in result phase to call advanceToConfigurePhase',
  );
  invariant(
    state.session.result.pending,
    'Must be in the result pending state to call uploadEvents',
  );

  const database = firebase.database();
  const uid = rootState.auth.uid;
  const sessionRef = database.ref(`/sessions/${state.session.id}`);
  await sessionRef.child(`users/${uid}/events`).set(rootState.calendar.events);
  await sessionRef.child(`users/${uid}/ready`).set(true);
}

// TODO make this a cloud function
async function disposeSession({ commit, state }) {
  invariant(state.isInSession, 'Must be in session to call disposeSession');
  invariant(state.session.isHost, 'Must be host to call disposeSession');

  const sessionId = state.session.id;
  const database = firebase.database();
  const sessionRef = database.ref(`/sessions/${sessionId}`);
  const userIds = Object.keys(
    (await sessionRef.child('users').once('value')).val(),
  );
  await Promise.all([
    sessionRef.child('phase').set(PHASE_ARCHIVED),
    ...userIds.map(uid =>
      database.ref(`/users/${uid}/previousSessions`).push(sessionId),
    ),
    ...userIds.map(uid =>
      database.ref(`/users/${uid}/currentSession`).set(null),
    ),
  ]);
}
