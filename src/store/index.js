import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import calendars from './modules/calendars';
import progress from './modules/progress';
import profile from './modules/profile';
import planner from './modules/planner';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    calendars,
    progress,
    profile,
    planner,
  },
  state: {
    routePending: false,
  },
  mutations: {
    updateRoutePending(state, status) {
      state.routePending = status;
    },
  },
});

export default store;
