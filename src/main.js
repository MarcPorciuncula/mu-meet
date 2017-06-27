// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import store from './store';
import Wrapper from './components/Wrapper';
import './firebase.config.js';
import './index.scss';

Vue.config.productionTip = false;

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<Wrapper/>',
  components: {
    Wrapper,
  },
});

if (process.env.NODE_ENV !== 'production') {
  window.vm = vm;
}
