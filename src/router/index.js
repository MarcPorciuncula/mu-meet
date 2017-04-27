import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Initialisation from '@/components/Initialisation';
import Room from '@/components/Room';
import SignIn from '@/components/SignIn';
import SelectCalendars from '@/components/SelectCalendars';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/login',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/calendars',
      name: 'SelectCalendars',
      component: SelectCalendars,
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
