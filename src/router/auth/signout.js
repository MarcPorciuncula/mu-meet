import store from '@/store';
import landing from '@/router/landing';
import { SIGN_OUT } from '@/store/actions';

async function beforeEnter(to, from, next) {
  await store.dispatch(SIGN_OUT);
  next({ name: landing.name });
}

export default {
  name: 'signout',
  path: '/signout',
  beforeEnter,
};
