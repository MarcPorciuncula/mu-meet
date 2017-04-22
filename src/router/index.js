import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Initialisation from '@/components/Initialisation';
import Room from '@/components/Room';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/start',
      name: 'Initialisation',
      component: Initialisation,
    },
    {
      path: '/room',
      name: 'Room',
      component: Room,
    },
  ],
});
