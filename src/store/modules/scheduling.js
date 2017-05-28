import * as firebase from 'firebase';
import R from 'ramda';
import invariant from 'invariant';
import { functions } from '@/functions';

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
    .ref(`/users/${uid}/current-session`)
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
  await functions('createSession');
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
    .ref(`/users/${rootState.auth.uid}/current-session`)
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

  await functions('findMeetingTimes');
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
      database.ref(`/users/${uid}/current-session`).set(null),
    ),
  ]);
}
