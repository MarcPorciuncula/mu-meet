// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Output from './components/Output.vue';
import router from './router';
import store from './store';
import KeenUI from 'keen-ui';
import './index.css';
import 'keen-ui/dist/keen-ui.css';
import './firebase.config.js';

Vue.config.productionTip = false;

Vue.use(KeenUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<Output/>',
  components: { Output },
});
