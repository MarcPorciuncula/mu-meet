import Vue from 'vue';
import invariant from 'invariant';
import { omit, pickBy, prop } from 'ramda';
import Calendars from '@/api/calendars';
import {
  UPDATE_CALENDAR,
  CLEAR_CALENDARS,
  UPDATE_CALENDARS_PENDING_OPS,
} from '@/store/mutations';
import {
  FETCH_CALENDARS,
  ENABLE_DISABLE_CALENDAR,
  SYNC_CALENDARS,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
  RESET_CALENDARS,
} from '@/store/actions';
import {
  USER_UID,
  CALENDARS,
  SELECTED_CALENDARS,
  CALENDARS_PENDING_OPS,
} from '@/store/getters';

const state = {
  value: {},
  pending: {
    [SYNC_CALENDARS]: false,
  },
};

const mutations = {
  [UPDATE_CALENDAR](state, calendar) {
    if (!state[calendar.id]) {
      Vue.set(state.value, calendar.id, calendar);
    } else {
      Object.assign(state.value[calendar.id], omit(['id'], calendar));
    }
  },
  [CLEAR_CALENDARS](state) {
    state.value = {};
  },
  [UPDATE_CALENDARS_PENDING_OPS](state, patch) {
    Object.assign(state.pending, patch);
  },
};

const actions = {
  async [FETCH_CALENDARS](
    { commit, dispatch, getters },
    { progress = false } = {},
  ) {
    if (progress)
      dispatch(START_PROGRESS_ITEM, {
        type: FETCH_CALENDARS,
      });

    try {
      const calendars = await Calendars.forUser(getters[USER_UID]);
      for (let calendar of Object.values(calendars)) {
        commit(UPDATE_CALENDAR, calendar);
      }
    } finally {
      if (progress)
        dispatch(FINISH_PROGRESS_ITEM, {
          type: FETCH_CALENDARS,
        });
    }
  },
  async [ENABLE_DISABLE_CALENDAR]({ commit, state, getters }, { id, enabled }) {
    commit(UPDATE_CALENDAR, { id, selected: enabled });
    await Calendars.update(
      { uid: getters[USER_UID], id },
      { selected: enabled },
    );
  },
  async [SYNC_CALENDARS]({ commit, dispatch, getters, state }) {
    invariant(
      !state.pending[SYNC_CALENDARS],
      'Cannot sync calendars when a calendar sync is already in progress',
    );

    commit(UPDATE_CALENDARS_PENDING_OPS, { [SYNC_CALENDARS]: true });

    dispatch(START_PROGRESS_ITEM, {
      type: SYNC_CALENDARS,
      message: 'Syncing your calendars',
    });
    try {
      await Calendars.sync(getters[USER_UID]);
      await dispatch(FETCH_CALENDARS, { progress: false });
    } finally {
      commit(UPDATE_CALENDARS_PENDING_OPS, { [SYNC_CALENDARS]: false });
      dispatch(FINISH_PROGRESS_ITEM, {
        type: SYNC_CALENDARS,
      });
    }
  },
  async [RESET_CALENDARS]({ commit }) {
    commit(CLEAR_CALENDARS);
  },
};

const getters = {
  [CALENDARS](state, getters) {
    return state.value;
  },
  [SELECTED_CALENDARS](state, getters) {
    return pickBy(prop('selected'), getters[CALENDARS]);
  },
  [CALENDARS_PENDING_OPS](state, getters) {
    return state.pending;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
