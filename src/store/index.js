import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import calendar from './modules/calendar';
import session from './modules/session';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    calendar,
    session,
  },
});

export default store;
