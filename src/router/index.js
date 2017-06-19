import Vue from 'vue';
import VueRouter from 'vue-router';
import landing from './landing';
import login from './login';
import dashboard from './dashboard';
import calendars from './calendars';
import meet from './meet';
import store from '@/store';

Vue.use(VueRouter);

function addRouteTransitionProgressItem(to, from, next) {
  store.dispatch('addProgressItem', {
    id: 'router/transition',
  });
  next();
}

function clearRouteTransitionProgressItem(route) {
  store.dispatch('removeProgressItem', 'router/transition');
}

async function verifyAuth(to, from, next) {
  if (store.state.auth.isSignedIn === null) {
    await store.dispatch('refreshAuthStatus');
  }

  if (
    to.matched.some(route => route.meta.requiresAuth) &&
    !store.state.auth.isSignedIn
  ) {
    next({ path: login.path, query: { callback: to.fullPath } });
  } else {
    next();
  }
}

const router = new VueRouter({
  routes: [landing, login, dashboard, calendars, meet],
});

router.beforeEach(addRouteTransitionProgressItem);
router.afterEach(clearRouteTransitionProgressItem);
router.beforeEach(verifyAuth);

export default router;
