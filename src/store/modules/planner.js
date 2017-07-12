import invariant from 'invariant';
import firebase from '@/firebase';
import { functions } from '@/functions';
import LiveQuery from '@/util/subscriptions/FirebaseLiveQuery';
import { identity, evolve } from 'ramda';
import Vue from 'vue';
import parse from 'date-fns/parse';
import {
  UPDATE_PLANNER_SESSION,
  UPDATE_PLANNER_SUBSCRIPTION,
} from '@/store/mutations';
import {
  SUBSCRIBE_PLANNER_SESSION,
  UNSUBSCRIBE_PLANNER_SESSION,
  CREATE_PLANNER_SESSION,
  JOIN_PLANNER_SESSION,
  ARCHIVE_PLANNER_SESSION,
  REQUEST_PLANNER_RESULT,
  SET_PLANNER_CONFIG,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';
import {
  USER_UID,
  IS_IN_PLANNER_SESSION,
  IS_SUBSCRIBED_PLANNER_SESSION,
  CURRENT_PLANNER_SESSION,
} from '@/store/getters';

const database = firebase.database();

const state = {
  session: null,
  _subscription: null,
};

const mutations = {
  [UPDATE_PLANNER_SESSION](state, session) {
    state.session = session;
  },
  [UPDATE_PLANNER_SUBSCRIPTION](state, subscription) {
    state._subscription = subscription;
  },
};

const actions = {
  async [SUBSCRIBE_PLANNER_SESSION]({ commit, getters }) {
    invariant(
      !state._subscription,
      'attempted to subscribe to planner session but already subscribed',
    );

    const uid = getters[USER_UID];
    const root = database.ref();
    const user = root.child(`users/${uid}`);

    const subscription = new LiveQuery.Redirect(
      user.child('current-session'),
      (source, sessionId) => {
        const session = root.child(`sessions/${sessionId}`);
        return new LiveQuery.Object(session, {
          id: new LiveQuery.Leaf(source),
          startedAt: new LiveQuery.Leaf(session.child('startedAt'), {
            transform: parse,
          }),
          host: new LiveQuery.Redirect(session.child('host'), (_, uid) =>
            createUserSubscription(root.child(`/users/${uid}`)),
          ),
          users: new LiveQuery.List(session.child('users'), ref => {
            return createUserSubscription(root.child(`/users/${ref.key}`));
          }),
          config: new LiveQuery.Leaf(session.child('config'), {
            transform: evolve({ searchFromDate: parse, searchToDate: parse }),
          }),
          result: new LiveQuery.Leaf(session.child('result')),
        });
      },
    );

    const unsubscribe = subscription.subscribe({
      next: value => {
        commit(UPDATE_PLANNER_SESSION, value);
      },
      error: console.error.bind(console),
      complete: () => {},
    });

    commit(UPDATE_PLANNER_SUBSCRIPTION, {
      unsubscribe,
    });

    return new Promise((resolve, reject) => {
      const unsubscribe = subscription.subscribe({
        next: () => {
          resolve();
          unsubscribe();
        },
        error: reject,
        complete: () => {},
      });
    });
  },
  [UNSUBSCRIBE_PLANNER_SESSION]({ commit, getters, state }) {
    if (getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
      state._subscription.unsubscribe();
      commit(UPDATE_PLANNER_SUBSCRIPTION, null);
      commit(UPDATE_PLANNER_SESSION, null);
    }
  },
  async [CREATE_PLANNER_SESSION]({
    commit,
    redirect,
    state,
    getters,
    dispatch,
  }) {
    dispatch(START_PROGRESS_ITEM, {
      type: CREATE_PLANNER_SESSION,
      message: 'Creating meeting plan',
    });

    if (!getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
      dispatch(SUBSCRIBE_PLANNER_SESSION);
    }
    if (getters[IS_IN_PLANNER_SESSION]) {
      dispatch(ARCHIVE_PLANNER_SESSION);
    }
    const date = new Date();
    await functions('createSession', {
      data: {
        startedAt: date.toString(),
        timezoneOffset: date.getTimezoneOffset(),
      },
    });
    // wait for the subscription to pick up the new session id
    await watch(() => state.session && state.session.id);

    dispatch(FINISH_PROGRESS_ITEM, {
      type: CREATE_PLANNER_SESSION,
    });
  },
  async [JOIN_PLANNER_SESSION]({ state, getters, dispatch }, { id }) {
    dispatch(START_PROGRESS_ITEM, {
      type: JOIN_PLANNER_SESSION,
      message: 'Joining meeting plan ' + id,
    });

    if (!getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
      dispatch(SUBSCRIBE_PLANNER_SESSION);
    }
    if (getters[IS_IN_PLANNER_SESSION]) {
      dispatch(ARCHIVE_PLANNER_SESSION);
    }

    const session = database.ref(`/sessions/${id}`);
    const user = database.ref(`/users/${getters[USER_UID]}`);
    // startedAt is a public field, we can use it for an existence check
    const exists = session
      .child('startedAt')
      .once('value')
      .then(s => !!s.val());
    if (!exists) {
      throw new Error(`session ${id} does not exist`);
    }

    await session.child(`users/${getters[USER_UID]}`).set(true);
    await user.child('current-session').set(id);

    // wait for the subscription to pick up the new session id
    await watch(() => state.session && state.session.id);

    dispatch(FINISH_PROGRESS_ITEM, {
      type: JOIN_PLANNER_SESSION,
    });
  },
  async [ARCHIVE_PLANNER_SESSION]({ state, getters }) {
    const id = state.session.id;
    const user = database.ref(`/users/${getters[USER_UID]}`);

    await user.child('current-session').set(null);
    await user.child('previous-sessions').push(id);

    // wait for the subscription to pick up that the session is gone
    await watch(() => state.session, {
      predicate: session => session === null,
    });
  },
  async [REQUEST_PLANNER_RESULT]({ dispatch }) {
    dispatch(START_PROGRESS_ITEM, {
      type: REQUEST_PLANNER_RESULT,
      message: 'Finding meeting times',
    });

    await functions('findMeetingTimes');
    await watch(() => state.session.result.meetings);

    dispatch(FINISH_PROGRESS_ITEM, {
      type: REQUEST_PLANNER_RESULT,
    });
  },
  async [SET_PLANNER_CONFIG]({ state, commit, dispatch }, patch) {
    dispatch(START_PROGRESS_ITEM, {
      type: SET_PLANNER_CONFIG,
      message: 'Updating meeting parameters',
    });

    const config = Object.assign({}, state.session.config, patch);
    commit(
      UPDATE_PLANNER_SESSION,
      Object.assign({}, state.session, { config }),
    );

    const session = database.ref(`/sessions/${state.session.id}`);
    await session.child('config').set(
      evolve({
        searchFromDate: toString,
        searchToDate: toString,
      })(config),
    );
    dispatch(FINISH_PROGRESS_ITEM, {
      type: SET_PLANNER_CONFIG,
    });
  },
};

const getters = {
  [IS_IN_PLANNER_SESSION](state) {
    return !!state.session;
  },
  [IS_SUBSCRIBED_PLANNER_SESSION](state) {
    return !!state._subscription;
  },
  [CURRENT_PLANNER_SESSION](state) {
    return state.session;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};

function createUserSubscription(ref) {
  return new LiveQuery.Object(ref, {
    id: new LiveQuery.Key(ref),
    profile: new LiveQuery.Object(ref.child('profile'), ref => ({
      name: new LiveQuery.Leaf(ref.child('name')),
      picture: new LiveQuery.Leaf(ref.child('picture')),
      email: new LiveQuery.Leaf(ref.child('email')),
      givenName: new LiveQuery.Leaf(ref.child('given_name')),
    })),
  });
}

/**
 * Returns a promise that resolves when a Vue reactive value satisfies the predicate
 */
function watch(compute, { predicate = identity, timeout = 1000 } = {}) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    let vm;
    const handleValue = value => {
      if (predicate(value)) {
        resolve(value);
        resolved = true;
        vm.$destroy();
      }
    };
    vm = new Vue({
      computed: { value: compute },
      watch: { value: handleValue },
    });
    setTimeout(() => {
      if (!resolved) {
        reject(new Error(`watch timed out after ${timeout}ms`));
        vm.$destroy();
      }
    }, timeout);
    handleValue(compute());
  });
}

function toString(x) {
  return x.toString();
}
