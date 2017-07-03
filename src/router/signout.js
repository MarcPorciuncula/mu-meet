import store from '@/store';
import landing from './landing';
import { SIGN_OUT } from '@/store/actions';

async function beforeEnter(to, from, next) {
  await store.dispatch(SIGN_OUT);
  next(landing.path);
}

export default {
  path: '/signout',
  beforeEnter,
};
