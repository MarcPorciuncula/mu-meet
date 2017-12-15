// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import Wrapper from '@/views/Wrapper';
import '@/styles/index.scss';

Vue.config.productionTip = false;

/* eslint-disable no-new */
let vm = new Vue(
  Object.assign({}, Wrapper, {
    el: '#app',
    store,
    router,
  }),
);

if (process.env.NODE_ENV !== 'production') {
  window.vm = vm;
}
