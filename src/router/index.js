import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/components/Index';
import SignIn from '@/components/SignIn';
import SelectCalendars from '@/components/SelectCalendars';
import Session from '@/components/Session';
import SessionSetup from '@/components/SessionSetup';
import SessionLobby from '@/components/SessionLobby';
import SessionConfirm from '@/components/SessionConfirm';
import SessionResult from '@/components/SessionResult';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
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
      async beforeEnter(to, from, next) {
        if (store.state.auth.isSignedIn === null) {
          await store.dispatch('refreshAuthStatus');
        }
        next();
      },
    },
    {
      path: '/calendars',
      name: 'SelectCalendars',
      component: SelectCalendars,
      meta: { requiresAuth: true },
    },
    {
      path: '/session',
      name: 'Session',
      component: Session,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'setup',
          name: 'SessionSetup',
          component: SessionSetup,
        },
        {
          path: 'lobby',
          name: 'SessionLobby',
          component: SessionLobby,
        },
        {
          path: 'confirm',
          name: 'SessionConfirm',
          component: SessionConfirm,
        },
        {
          path: 'result',
          name: 'SessionResult',
          component: SessionResult,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  store.dispatch('addProgressItem', {
    id: 'ROUTE_TRANSITION',
  });
  next();
});

router.afterEach(async route => {
  store.dispatch('removeProgressItem', 'ROUTE_TRANSITION');
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.auth.isSignedIn === null) {
      const pending = store.dispatch('refreshAuthStatus');
      store.dispatch('addProgressItem', {
        id: 'REFRESH_AUTH_STATUS',
        done: pending,
        message: 'Checking auth status',
      });
      await pending;
    }
    if (!store.state.auth.isSignedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    } else {
      store.dispatch('ensureUserProfile', store.state.auth.uid);
      store.dispatch('fetchCalendars');
    }
  }
  next();
});

export default router;
