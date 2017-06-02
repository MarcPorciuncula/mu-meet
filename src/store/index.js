import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import calendars from './modules/calendars';
import scheduling from './modules/scheduling';
import users from './modules/users';
import progress from './modules/progress';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    calendars,
    scheduling,
    users,
    progress,
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
