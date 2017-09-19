import Profile from '@/api/profile';
import { UPDATE_PROFILE } from '@/store/mutations';
import { FETCH_USER_PROFILE } from '@/store/actions';
import { USER_PROFILE, USER_UID } from '@/store/getters';

const state = {
  email: null,
  name: null,
  family_name: null,
  given_name: null,
  picture: null,
};

const mutations = {
  [UPDATE_PROFILE](state, data) {
    Object.assign(state, data);
  },
};

const actions = {
  async [FETCH_USER_PROFILE]({ commit, getters }) {
    const profile = await Profile.get(getters[USER_UID]);
    commit(UPDATE_PROFILE, profile);
  },
};

const getters = {
  [USER_PROFILE](state) {
    return state;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
