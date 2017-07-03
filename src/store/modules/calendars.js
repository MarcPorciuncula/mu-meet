import Vue from 'vue';
import firebase from '@/firebase';
import invariant from 'invariant';
import { omit, pickBy, prop } from 'ramda';
import debounce from 'lodash/debounce';
import LiveQuery from '@/subscriptions/FirebaseLiveQuery';
import {
  UPDATE_CALENDAR,
  UPDATE_CALENDARS_SUBSCRIPTION,
} from '@/store/mutations';
import { SUBSCRIBE_CALENDARS, SET_CALENDAR_SELECTED } from '@/store/actions';
import {
  USER_UID,
  CALENDARS,
  SELECTED_CALENDARS,
  IS_SUBSCRIBED_CALENDARS,
} from '@/store/getters';

const database = firebase.database();

const state = {
  _subscription: null,
};

const mutations = {
  [UPDATE_CALENDAR](state, calendar) {
    invariant(calendar, 'must supply calendar data patch, got %s', calendar);
    invariant(
      calendar && typeof calendar.id === 'string',
      'must supply calendar.id, got %s',
      calendar.id,
    );

    if (!state[calendar.id]) {
      Vue.set(state, calendar.id, calendar);
    } else {
      Object.assign(state[calendar.id], omit(['id'], calendar));
    }
  },
  [UPDATE_CALENDARS_SUBSCRIPTION](state, { unsubscribe }) {
    state._subscription = { unsubscribe };
  },
};

const actions = {
  [SUBSCRIBE_CALENDARS]({ commit: _commit, rootState, state, getters }) {
    invariant(
      !state._subscription,
      'attempted to subscribe to calendars but already subscribed',
    );

    const commit = batch(_commit, 200);
    const uid = getters[USER_UID];
    const root = database.ref();
    const user = root.child(`users/${uid}`);

    // Construct the root subscription
    const subscription = new LiveQuery.List(user.child('calendars'), ref => {
      const query = new LiveQuery.Object(ref, {
        id: new LiveQuery.Leaf(ref.child('id')),
        summary: new LiveQuery.Leaf(ref.child('summary')),
        backgroundColor: new LiveQuery.Leaf(ref.child('backgroundColor')),
        selected: new LiveQuery.Redirect(
          ref.child('id'),
          (_, value) =>
            new LiveQuery.Leaf(
              user.child(`selected-calendars/${encodeId(value)}`),
            ),
        ),
      });

      // Subscribe to value updates on each child so we only have
      // to update that child instead of all of them
      query.subscribe({
        next: value => commit(UPDATE_CALENDAR, value),
        error: err => console.error(err),
        complete: () => {},
      });

      return query;
    });

    subscription.execute();

    commit(UPDATE_CALENDARS_SUBSCRIPTION, {
      unsubscribe: () => subscription.cancel(),
    });
  },
  async [SET_CALENDAR_SELECTED](
    { commit, state, rootState },
    { id, selected },
  ) {
    invariant(id, 'must supply calendar.id, got %s', id);
    invariant(
      typeof selected !== 'undefined',
      'must supply calendar.selected, got %s',
      selected,
    );
    invariant(state[id], 'there was no calendar in the state with id %s', id);

    commit(UPDATE_CALENDAR, { id, selected });
    const uid = rootState.auth.uid;
    const root = database.ref();
    const user = root.child(`users/${uid}`);

    await user.child(`selected-calendars/${encodeId(id)}`).set(selected);
  },
};

const getters = {
  [CALENDARS](state, getters) {
    return omit(['_subscription'], state);
  },
  [SELECTED_CALENDARS](state, getters) {
    return pickBy(prop('selected'), getters[CALENDARS]);
  },
  [IS_SUBSCRIBED_CALENDARS](state, getters) {
    return !!state._subscription;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

function encodeId(id) {
  return btoa(id);
}

// function decodeId(id) {
//   return atob(id);
// }

function batch(fn, freq) {
  const queue = [];
  const flush = () => {
    while (queue.length) {
      fn(...queue.shift());
    }
  };
  const apply = debounce(flush, freq);
  return (...args) => {
    queue.push([...args]);
    apply();
  };
}
