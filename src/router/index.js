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
import Dashboard from '@/components/Dashboard';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: { shell: false },
    },
    {
      path: '/login',
      name: 'SignIn',
      component: SignIn,
      meta: { shell: true },
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
      meta: { shell: true, requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { shell: true, requiresAuth: true },
    },
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
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.auth.isSignedIn === null) {
      await store.dispatch('refreshAuthStatus');
    }
    if (!store.state.auth.isSignedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    } else {
      store.dispatch('ensureUserProfile', store.state.auth.uid);
    }
  }
  next();
});

export default router;
