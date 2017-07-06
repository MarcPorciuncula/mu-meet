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
import {
  REFRESH_AUTH_STATUS,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
} from '@/store/actions';

Vue.use(VueRouter);

const ROUTER_TRANSITION = 'router/ROUTER_TRANSITION';

function addRouteTransitionProgressItem(to, from, next) {
  store.dispatch(START_PROGRESS_ITEM, {
    type: ROUTER_TRANSITION,
  });
  next();
}

function clearRouteTransitionProgressItem(route) {
  store.dispatch(FINISH_PROGRESS_ITEM, { type: ROUTER_TRANSITION });
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
  mode: 'history',
  routes: [landing, signin, signout, dashboard, calendars, meet],
});

router.beforeEach(addRouteTransitionProgressItem);
router.afterEach(clearRouteTransitionProgressItem);
router.beforeEach(verifyAuth);

export default router;
