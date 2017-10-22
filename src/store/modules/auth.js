import invariant from 'invariant';
import Auth from '@/api/auth';
import { UPDATE_AUTH_STATE } from '@/store/mutations';
import {
  REFRESH_AUTH_STATUS,
  SIGN_IN,
  SIGN_OUT,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
  RESET_PROFILE,
  RESET_CALENDARS,
  RESET_PLANNER,
} from '@/store/actions';
import { USER_UID, IS_SIGNED_IN, SIGN_IN_PENDING } from '@/store/getters';

const PENDING_INITIAL_REFRESH = 'PENDING_INITIAL_REFRESH';
const PENDING_SIGN_IN = 'PENDING_SIGN_IN';
const PENDING_SIGN_OUT = 'PENDING_SIGN_OUT';
const PENDING_REFRESH = 'PENDING_REFRESH';

const state = {
  uid: null, // null for indeterminate, need to refresh to find out
  pending: PENDING_INITIAL_REFRESH,
};

const mutations = {
  [UPDATE_AUTH_STATE](state, data) {
    Object.assign(state, data);
  },
};

const actions = {
  async [REFRESH_AUTH_STATUS]({ commit }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_REFRESH,
    });

    const user = await Auth.user();

    commit(UPDATE_AUTH_STATE, {
      uid: user ? user.uid : null,
      pending: null,
    });
  },
  async [SIGN_IN]({ commit, dispatch, state }) {
    invariant(
      state.pending !== PENDING_SIGN_IN,
      'Cannot sign in while another sign in is in progress.',
    );

    // TODO reimplement granular progress
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_IN,
    });
    dispatch(START_PROGRESS_ITEM, {
      type: SIGN_IN,
      message: 'Signing in',
    });

    try {
      const user = await Auth.login();
      commit(UPDATE_AUTH_STATE, {
        uid: user.uid,
      });
    } finally {
      commit(UPDATE_AUTH_STATE, {
        pending: null,
      });
      dispatch(FINISH_PROGRESS_ITEM, { type: SIGN_IN });
    }
  },
  async [SIGN_OUT]({ commit, dispatch, state }) {
    invariant(
      ![PENDING_SIGN_IN, PENDING_SIGN_OUT].includes(state.pending),
      'Cannot sign out while a sign in or sign out is in progress',
    );

    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_OUT,
    });

    Auth.logout();
    dispatch(RESET_PROFILE);
    dispatch(RESET_CALENDARS);
    dispatch(RESET_PLANNER);

    commit(UPDATE_AUTH_STATE, {
      uid: null,
      pending: null,
    });
  },
};

const getters = {
  [USER_UID](state) {
    return state.uid;
  },
  [IS_SIGNED_IN](state, getters) {
    if (state.pending === PENDING_INITIAL_REFRESH) {
      return null;
    }
    return !!getters[USER_UID];
  },
  [SIGN_IN_PENDING](state) {
    return !!state.pending;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
