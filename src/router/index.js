import Vue from 'vue';
import VueRouter from 'vue-router';
import landing from './landing';
import signin from './signin';
import signout from './signout';
import dashboard from './dashboard';
import calendars from './calendars';
import meet from './meet';
import store from '@/store';
import { IS_SIGNED_IN } from '@/store/getters';
import { REFRESH_AUTH_STATUS } from '@/store/actions';

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
  if (store.getters[IS_SIGNED_IN] === null) {
    // Auth state is currently indeterminate
    await store.dispatch(REFRESH_AUTH_STATUS);
  }

  if (
    to.matched.some(route => route.meta.requiresAuth) &&
    !store.getters[IS_SIGNED_IN]
  ) {
    next({ path: signin.path, query: { callback: to.fullPath } });
  } else {
    next();
  }
}

const router = new VueRouter({
  routes: [landing, signin, signout, dashboard, calendars, meet],
});

router.beforeEach(addRouteTransitionProgressItem);
router.afterEach(clearRouteTransitionProgressItem);
router.beforeEach(verifyAuth);

export default router;
