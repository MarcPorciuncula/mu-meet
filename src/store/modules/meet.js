// @flow
import firebase from 'firebase';
import { functions } from '@/functions';

type EmptySessionState = {
  id: null,
  host: null,
};

type SessionState =
  | EmptySessionState
  | {
      id: string,
      host: string,
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
  if (state.isInSession) {
    throw new Error('Already in session');
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
    users: { [getters.authUid]: { ready: false } },
  });
  await dispatch('subscribeMeetSession');
  dispatch('removeProgressItem', 'meet/create-session');
}

async function subscribeMeetSession({
  state,
  dispatch,
  commit,
}: DispatchContext) {
  if (state.session.id === null) {
    throw new Error('No session to subscribe to');
  }

  const database = firebase.database();

  console.log(state.session.id);
  const sessionRef = database.ref(`/sessions/${state.session.id}`);
  await new Promise(resolve => {
    const handler = snapshot => {
      resolve();
      const data = snapshot.val();
      console.log(data);
      if (data) {
        commit('updateMeetSessionState', {
          host: data.host,
          users: data.users,
        });
      } else {
        dispatch('unsubscribeMeetSession');
      }
    };
    commit('updateMeetState', {
      unsubscribe: () => {
        sessionRef.off('value', handler);
      },
    });
    sessionRef.on('value', handler);
  });

  console.log('adad');

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
    }: SessionState),
  );
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
    subscribeMeetSession,
    unsubscribeMeetSession,
  },
};
