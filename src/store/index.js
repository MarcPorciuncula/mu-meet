import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import calendars from './modules/calendars';
import users from './modules/users';
import progress from './modules/progress';
import meet from './modules/meet';
import planner from './modules/planner';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    calendars,
    users,
    progress,
    meet,
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
