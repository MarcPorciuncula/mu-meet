import Vue from 'vue';
import VueRouter from 'vue-router';
import Session from '@/components/Session';
import SessionSetup from '@/components/SessionSetup';
import SessionLobby from '@/components/SessionLobby';
import SessionConfirm from '@/components/SessionConfirm';
import SessionResult from '@/components/SessionResult';
import landing from './landing';
import login from './login';
import dashboard from './dashboard';
import calendars from './calendars';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    landing,
    login,
    dashboard,
    calendars,
    {
      path: '/session',
      name: 'Session',
      component: Session,
      meta: { shell: true, requiresAuth: true },
      children: [
        {
          path: 'setup',
          name: 'SessionSetup',
          component: SessionSetup,
          meta: { shell: true, requiresAuth: true },
        },
        {
          path: 'lobby',
          name: 'SessionLobby',
          component: SessionLobby,
          meta: { shell: true, requiresAuth: true },
        },
        {
          path: 'confirm',
          name: 'SessionConfirm',
          component: SessionConfirm,
          meta: { shell: true, requiresAuth: true },
        },
        {
          path: 'result',
          name: 'SessionResult',
          component: SessionResult,
          meta: { shell: true, requiresAuth: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  store.dispatch('addProgressItem', {
    id: 'router/transition',
  });
  next();
});

router.afterEach(async route => {
  store.dispatch('removeProgressItem', 'router/transition');
});

router.beforeEach(async (to, from, next) => {
  if (store.state.auth.isSignedIn === null) {
    await store.dispatch('refreshAuthStatus');
  }
  next();
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   if (store.state.auth.isSignedIn === null) {
  //   }
  //   if (!store.state.auth.isSignedIn) {
  //     next({ path: '/login', query: { redirect: to.fullPath } });
  //     return;
  //   } else {
  //     store.dispatch('ensureUserProfile', store.state.auth.uid);
  //   }
  // }
  // next();
});

export default router;
