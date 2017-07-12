import Vue from 'vue';
import firebase from '@/firebase';
import invariant from 'invariant';
import { omit, pickBy, prop } from 'ramda';
import debounce from 'lodash/debounce';
import LiveQuery from '@/util/subscriptions/FirebaseLiveQuery';
import { functions } from '@/functions';
import a from 'awaiting';
import {
  UPDATE_CALENDAR,
  UPDATE_CALENDARS_SUBSCRIPTION,
  CLEAR_CALENDARS,
} from '@/store/mutations';
import {
  SUBSCRIBE_CALENDARS,
  UNSUBSCRIBE_CALENDARS,
  SET_CALENDAR_SELECTED,
  FETCH_CALENDARS_TO_DATABASE,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';
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
  [UPDATE_CALENDARS_SUBSCRIPTION](state, subscription) {
    state._subscription = subscription;
  },
  [CLEAR_CALENDARS](state) {
    Object.keys(state).forEach(key => {
      if (key !== '_subscription') {
        Vue.delete(state, key);
      }
    });
  },
};

const actions = {
  async [SUBSCRIBE_CALENDARS]({
    commit: _commit,
    rootState,
    state,
    getters,
    dispatch,
  }) {
    invariant(
      !state._subscription,
      'attempted to subscribe to calendars but already subscribed',
    );

    dispatch(START_PROGRESS_ITEM, {
      type: SUBSCRIBE_CALENDARS,
      message: 'Fetching your calendars',
    });

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
        next: value => value && commit(UPDATE_CALENDAR, value),
        error: err => console.error(err),
        complete: () => {
          console.log('Calendar removed');
        },
      });

      return query;
    });

    subscription.execute();

    _commit(UPDATE_CALENDARS_SUBSCRIPTION, {
      unsubscribe: () => subscription.cancel(),
    });

    await a.single([
      new Promise((resolve, reject) => {
        const unsubscribe = subscription.subscribe({
          next: () => {
            resolve();
            unsubscribe(false);
          },
          error: reject,
          complete: () => {},
        });
      }),
      a.delay(4e3),
    ]);

    dispatch(FINISH_PROGRESS_ITEM, {
      type: SUBSCRIBE_CALENDARS,
    });
  },
  [UNSUBSCRIBE_CALENDARS]({ commit, getters, state }) {
    if (getters[IS_SUBSCRIBED_CALENDARS]) {
      state._subscription.unsubscribe();
      commit(UPDATE_CALENDARS_SUBSCRIPTION, null);
      commit(CLEAR_CALENDARS);
    }
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
  async [FETCH_CALENDARS_TO_DATABASE]({ dispatch }) {
    dispatch(START_PROGRESS_ITEM, {
      type: FETCH_CALENDARS_TO_DATABASE,
      message: 'Syncing your calendars',
    });
    await functions('getCalendars');
    dispatch(FINISH_PROGRESS_ITEM, {
      type: FETCH_CALENDARS_TO_DATABASE,
    });
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
