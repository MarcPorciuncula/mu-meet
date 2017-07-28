import { UPDATE_AUTH_STATE } from '@/store/mutations';
import {
  REFRESH_AUTH_STATUS,
  SIGN_IN,
  SIGN_OUT,
  START_PROGRESS_ITEM,
  INCREMENT_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
  UNSUBSCRIBE_CALENDARS,
  UNSUBSCRIBE_USER_PROFILE,
  UNSUBSCRIBE_PLANNER_SESSION,
} from '@/store/actions';
import { USER_UID, IS_SIGNED_IN, SIGN_IN_PENDING } from '@/store/getters';
import {
  getIsAuthenticated,
  getCurrentUserUid,
  signInWithProgress,
  signOut,
} from '@/api/auth';

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
    commit(UPDATE_AUTH_STATE, { pending: PENDING_REFRESH });

    const uid = (await getIsAuthenticated()) ? await getCurrentUserUid() : null;

    commit(UPDATE_AUTH_STATE, {
      uid,
      pending: null,
    });
  },
  [SIGN_IN]({ commit, dispatch }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_IN,
    });

    dispatch(START_PROGRESS_ITEM, {
      type: SIGN_IN,
      message: 'Signing in',
    });

    return new Promise((resolve, reject) => {
      const progress = signInWithProgress();
      progress.subscribe({
        next: step =>
          dispatch(INCREMENT_PROGRESS_ITEM, {
            type: SIGN_IN,
            message: `Signing in (Step ${step}/4)`,
          }),
        complete: async () => {
          commit(UPDATE_AUTH_STATE, {
            uid: await getCurrentUserUid(),
            pending: null,
          });

          dispatch(FINISH_PROGRESS_ITEM, { type: SIGN_IN });
          resolve();
        },
        error: reject,
      });
    });
  },
  async [SIGN_OUT]({ commit, dispatch }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_OUT,
    });

    dispatch(UNSUBSCRIBE_CALENDARS);
    dispatch(UNSUBSCRIBE_PLANNER_SESSION);
    dispatch(UNSUBSCRIBE_USER_PROFILE);

    await signOut();

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
  getters: {
    ...getters,
  },
};

function once(listen) {
  return new Promise(resolve => {
    const unlisten = listen(value => {
      unlisten();
      resolve(value);
    });
  });
}
