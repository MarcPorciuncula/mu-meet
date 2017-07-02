import invariant from 'invariant';
import firebase from 'firebase';
// import { functions } from '@/functions';
import LiveQuery from '@/subscriptions/FirebaseLiveQuery';
import parse from 'date-fns/parse';
import {
  UPDATE_PLANNER_SESSION,
  UPDATE_PLANNER_SUBSCRIPTION,
} from '@/store/mutations';
import { SUBSCRIBE_PLANNER_SESSION } from '@/store/actions';
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
  [SUBSCRIBE_PLANNER_SESSION]({ commit, getters }) {
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
          config: new LiveQuery.Leaf(session.child('config')),
          result: new LiveQuery.Leaf(session.child('result')),
        });
      },
    );

    const unsubscribe = subscription.subscribe({
      next: value => commit(UPDATE_PLANNER_SESSION, value),
      error: console.error.bind(console),
      complete: () => {},
    });

    commit(UPDATE_PLANNER_SUBSCRIPTION, {
      unsubscribe,
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
    profile: new LiveQuery.Object(ref.child('profile'), ref => ({
      name: new LiveQuery.Leaf(ref.child('name')),
      picture: new LiveQuery.Leaf(ref.child('picture')),
      email: new LiveQuery.Leaf(ref.child('email')),
      givenName: new LiveQuery.Leaf(ref.child('given_name')),
    })),
  });
}
