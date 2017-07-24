import LiveQuery from '@/util/subscriptions/FirebaseLiveQuery';
import invariant from 'invariant';
import { omit } from 'ramda';
import { UPDATE_PROFILE, UPDATE_PROFILE_SUBSCRIPTION } from '@/store/mutations';
import {
  SUBSCRIBE_USER_PROFILE,
  UNSUBSCRIBE_USER_PROFILE,
} from '@/store/actions';
import {
  USER_PROFILE,
  USER_UID,
  IS_SUBSCRIBED_USER_PROFILE,
} from '@/store/getters';
import firebase from '@/firebase';

const database = firebase.database();

const state = {
  email: null,
  name: null,
  family_name: null,
  given_name: null,
  picture: null,
  _subscription: null,
};

const mutations = {
  [UPDATE_PROFILE](state, data) {
    Object.assign(state, data);
  },
  [UPDATE_PROFILE_SUBSCRIPTION](state, subscription) {
    state._subscription = subscription;
  },
};

const actions = {
  [SUBSCRIBE_USER_PROFILE]({ commit, getters }) {
    invariant(
      !state._subscription,
      'attempted to subscribe to calendars but already subscribed',
    );

    const user = database.ref(`/users/${getters[USER_UID]}`);
    const subscription = new LiveQuery.Leaf(user.child('profile'));
    const unsubscribe = subscription.subscribe({
      next: value => commit(UPDATE_PROFILE, value),
      error: console.error.bind(console),
      complete: () => {},
    });

    commit(UPDATE_PROFILE_SUBSCRIPTION, { unsubscribe });

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
  async [UNSUBSCRIBE_USER_PROFILE]({ commit, getters, state }) {
    if (getters[IS_SUBSCRIBED_USER_PROFILE]) {
      state._subscription.unsubscribe();
      commit(UPDATE_PROFILE_SUBSCRIPTION, null);
      commit(UPDATE_PROFILE, {
        email: null,
        name: null,
        family_name: null,
        given_name: null,
        picture: null,
      });
    }
  },
};

const getters = {
  [USER_PROFILE](state) {
    return omit(['_subscription'], state);
  },
  [IS_SUBSCRIBED_USER_PROFILE](state) {
    return !!state._subscription;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
