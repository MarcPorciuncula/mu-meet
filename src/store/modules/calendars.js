import Vue from 'vue';
import { omit, pickBy, prop } from 'ramda';
import Calendars from '@/api/calendars';
import { UPDATE_CALENDAR, CLEAR_CALENDARS } from '@/store/mutations';
import {
  FETCH_CALENDARS,
  ENABLE_DISABLE_CALENDAR,
  SYNC_CALENDARS,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';
import { USER_UID, CALENDARS, SELECTED_CALENDARS } from '@/store/getters';

const state = {};

const mutations = {
  [UPDATE_CALENDAR](state, calendar) {
    if (!state[calendar.id]) {
      Vue.set(state, calendar.id, calendar);
    } else {
      Object.assign(state[calendar.id], omit(['id'], calendar));
    }
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
  async [SYNC_CALENDARS]({ dispatch, getters }) {
    dispatch(START_PROGRESS_ITEM, {
      type: SYNC_CALENDARS,
      message: 'Syncing your calendars',
    });
    try {
      await Calendars.sync(getters[USER_UID]);
      await dispatch(FETCH_CALENDARS, { progress: false });
    } finally {
      dispatch(FINISH_PROGRESS_ITEM, {
        type: SYNC_CALENDARS,
      });
    }
  },
};

const getters = {
  [CALENDARS](state, getters) {
    return state;
  },
  [SELECTED_CALENDARS](state, getters) {
    return pickBy(prop('selected'), getters[CALENDARS]);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
