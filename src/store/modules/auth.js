import Auth from '@/api/auth';
import { UPDATE_AUTH_STATE } from '@/store/mutations';
import {
  REFRESH_AUTH_STATUS,
  SIGN_IN,
  SIGN_OUT,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';
import { USER_UID, IS_SIGNED_IN, SIGN_IN_PENDING } from '@/store/getters';

const PENDING_INITIAL_REFRESH = 'PENDING_INITIAL_REFRESH';
const PENDING_SIGN_IN = 'PENDING_SIGN_IN';
const PENDING_SIGN_OUT = 'PENDING_SIGN_OUT';
const PENDING_REFRESH = 'PENDING_REFRESH';

const state = {
  uid: null,
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
  async [SIGN_IN]({ commit, dispatch }) {
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
  async [SIGN_OUT]({ commit, dispatch }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_OUT,
    });

    Auth.logout();

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
