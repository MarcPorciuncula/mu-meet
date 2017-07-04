import Vue from 'vue';
import { filter, both, prop, reduce, maxBy, minBy } from 'ramda';
import { UPDATE_PROGRESS_ITEM, INCREMENT_PROGRESS } from '@/store/mutations';
import {
  START_PROGRESS_ITEM,
  INCREMENT_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';
import {
  PROGRESS_MESSAGE,
  SHOW_PROGRESS_BAR_AT,
  WATCH_PROGRESS_INCREMENT,
} from '@/store/getters';

const state = {
  items: {},
  delay: 500,
  incremented: 0,
};

const mutations = {
  [UPDATE_PROGRESS_ITEM](state, item) {
    if (!state.items[item.type]) {
      Vue.set(state.items, item.type, item);
    } else {
      Object.assign(state.items[item.type], item);
    }
  },
  [INCREMENT_PROGRESS](state) {
    state.incremented = state.incremented + 1;
  },
};

const actions = {
  [START_PROGRESS_ITEM]({ commit }, { type, message }) {
    const now = performance.now();
    commit(UPDATE_PROGRESS_ITEM, {
      type,
      message,
      started: now,
      pending: true,
    });
  },
  [INCREMENT_PROGRESS_ITEM]({ commit }, { type, message }) {
    commit(UPDATE_PROGRESS_ITEM, {
      type,
      message,
    });
    commit(INCREMENT_PROGRESS);
  },
  [FINISH_PROGRESS_ITEM]({ commit }, { type }) {
    commit(UPDATE_PROGRESS_ITEM, {
      type,
      message: null,
      started: null,
      pending: false,
    });
  },
};

const getters = {
  [PROGRESS_MESSAGE](state) {
    const items = Object.values(state.items);
    const inProgress = filter(both(prop('pending'), prop('message')))(items);
    if (inProgress.length === 0) {
      return null;
    }
    const latest = reduce(maxBy(prop('started')), { started: -Infinity })([
      ...inProgress,
    ]);
    return latest.message;
  },
  [SHOW_PROGRESS_BAR_AT](state) {
    const items = Object.values(state.items);
    const inProgress = filter(prop('pending'))(items);
    if (inProgress.length === 0) {
      return null;
    }
    const earliest = reduce(minBy(prop('started')), { started: Infinity })(
      inProgress,
    );
    // only show the progress bar after the delay to prevent immediate progress bar completion
    return earliest.started + state.delay;
  },
  [WATCH_PROGRESS_INCREMENT](state) {
    return state.incremented;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
