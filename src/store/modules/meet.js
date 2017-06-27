// @flow
import firebase from 'firebase';
import R from 'ramda';
import { functions } from '@/functions';
import addSeconds from 'date-fns/add_seconds';
import { query } from '@/graphql';

type EmptySessionState = {
  id: null,
  host: null,
  users: {},
  result: {
    meetings: [],
  },
};

type UserState = {
  connected: boolean,
};

type SessionState =
  | EmptySessionState
  | {
      id: string,
      host: string,
      users: { [uid: string]: UserState },
      result: {
        meetings: Array<{
          duration: number,
          start: Date,
          end: Date,
        }>,
      },
    };

type State = {
  session: SessionState,
  isSubscribed: boolean,
  pending: string | false,
  unsubscribe: () => void,
};

type DispatchContext = {
  state: State,
  commit: any,
  dispatch: any,
  getters: any,
  rootState: any,
};

const state = ({
  session: {
    id: null,
    host: null,
    users: {},
    result: {
      meetings: [],
    },
  },
  isSubscribed: false,
  pending: false,
  unsubscribe: () => {},
}: State);

function updateMeetState(state: State, data: any) {
  Object.assign(state, data);
}

function updateMeetSessionState(state: State, data: any) {
  Object.assign(state.session, data);
}

function getIsInSession(state: State): boolean {
  return !!state.session.id;
}

function getIsHost(state: State, getters: any): boolean {
  return getters.authUid === getters.isInSession && !!state.session.host;
}

async function refreshMeetSession({
  state,
  dispatch,
  commit,
  getters,
}: DispatchContext) {
  const database = firebase.database();

  const sessionId = await database
    .ref(`/users/${getters.authUid}/current-session`)
    .once('value')
    .then(s => s.val());
  commit('updateMeetSessionState', {
    id: sessionId,
  });
  if (sessionId) {
    await dispatch('subscribeMeetSession');
  }
}

async function createMeetSession({
  state,
  dispatch,
  commit,
  getters,
}: DispatchContext) {
  if (getters.isInSession) {
    await dispatch('archiveMeetSession');
  }
  const database = firebase.database();

  dispatch('addProgressItem', {
    id: 'meet/create-session',
    message: 'Starting a meeting plan',
  });
  const now = new Date();
  await functions('createSession', {
    data: {
      startedAt: now.toString(),
      timezoneOffset: now.getTimezoneOffset(),
    },
  });

  const sessionId = await database
    .ref(`/users/${getters.authUid}/current-session`)
    .once('value')
    .then(s => s.val());
  commit('updateMeetSessionState', {
    id: sessionId,
    host: getters.authUid,
    users: { [getters.authUid]: { subscribed: false } },
  });
  await dispatch('subscribeMeetSession');
  dispatch('removeProgressItem', 'meet/create-session');
}

async function joinMeetSession(
  { state, dispatch, commit, rootState, getters }: DispatchContext,
  id: string,
) {
  const database = firebase.database();

  if (getters.isInSession) {
    await dispatch('archiveMeetSession');
  }

  dispatch('addProgressItem', {
    id: 'meet/join-session',
    message: `Joining meeting plan ${id}`,
  });

  const sessionRef = database.ref(`/sessions/${id}`);

  const res = await query({
    query: gql`
      query SessionExistenceQuery($id: ID!) {
        session(id: $id) {
          startedAt
        }
      }
    `,
    vars: { id },
    root: database.ref(),
  });

  console.log(res);
  const startedAt = R.path(['data', 'session', 'startedAt'])(res);

  // const startedAt = await sessionRef
  //   .child('startedAt')
  //   .once('value')
  //   .then(s => s.val());
  if (startedAt === null) {
    throw new Error('session does not exist');
  }

  await database.ref(`/users/${rootState.auth.uid}/current-session`).set(id);
  await sessionRef.child(`/users/${rootState.auth.uid}/subscribed`).set(false);
  commit('updateMeetSessionState', {
    id,
    users: { [rootState.auth.uid]: { subscribed: false } },
  });
  await dispatch('subscribeMeetSession');

  dispatch('removeProgressItem', 'meet/join-session');
}

async function subscribeMeetSession({
  state,
  dispatch,
  commit,
  rootState,
}: DispatchContext) {
  if (state.session.id === null) {
    throw new Error('No session to subscribe to');
  }

  const database = firebase.database();

  const sessionRef = database.ref(`/sessions/${state.session.id}`);
  const subscribedRef = sessionRef.child(
    `/users/${rootState.auth.uid}/subscribed`,
  );

  await subscribedRef.onDisconnect().set(false);
  await subscribedRef.set(true);
  await new Promise(resolve => {
    const handler = snapshot => {
      resolve();
      const data = snapshot.val();
      console.log(data);
      if (data) {
        commit(
          'updateMeetSessionState',
          R.evolve({
            result: R.evolve({
              meetings: R.defaultTo([])(
                R.map(
                  R.evolve({
                    start: (datestring: string) => new Date(datestring),
                    end: (datestring: string) =>
                      addSeconds(new Date(datestring), 1),
                  }),
                ),
              ),
            }),
          })(data),
        );
        if (typeof data.users === 'object') {
          Object.keys(data.users).forEach(uid =>
            dispatch('ensureUserProfile', uid),
          );
        }
      } else {
        dispatch('unsubscribeMeetSession');
      }
    };
    commit('updateMeetState', {
      unsubscribe: () => {
        sessionRef.off('value', handler);
        sessionRef.onDisconnect().cancel();
        subscribedRef.set(false);
      },
    });
    sessionRef.on('value', handler);
  });

  commit('updateMeetState', {
    isSubscribed: true,
  });
}

function unsubscribeMeetSession({ commit, state }: DispatchContext) {
  state.unsubscribe();
  commit('updateMeetState', {
    isSubscribed: false,
    unsubscribe: () => {},
  });
  commit(
    'updateMeetSessionState',
    ({
      id: null,
      host: null,
      users: {},
      result: {
        meetings: [],
      },
    }: SessionState),
  );
}

async function requestMeetResult({ dispatch }: DispatchContext) {
  dispatch('addProgressItem', {
    id: 'meet/request-result',
    message: 'Finding meeting times',
  });
  await functions('findMeetingTimes');
  dispatch('removeProgressItem', 'meet/request-result');
}

async function archiveMeetSession({
  state,
  dispatch,
  rootState,
}: DispatchContext) {
  if (!state.session.id) {
    throw new Error('Not in session');
  }

  const database = firebase.database();
  await database.ref(`/users/${rootState.auth.uid}/current-session`).set(null);
  await database
    .ref(`/users/${rootState.auth.uid}/previous-sessions`)
    .push(state.session.id);
  await dispatch('unsubscribeMeetSession');
}

export default {
  state,
  getters: {
    isInSession: getIsInSession,
    isHost: getIsHost,
  },
  mutations: {
    updateMeetState,
    updateMeetSessionState,
  },
  actions: {
    refreshMeetSession,
    createMeetSession,
    joinMeetSession,
    subscribeMeetSession,
    unsubscribeMeetSession,
    requestMeetResult,
    archiveMeetSession,
  },
};
