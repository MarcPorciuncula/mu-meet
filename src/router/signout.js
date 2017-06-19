import store from '@/store';
import landing from './landing';

async function beforeEnter(to, from, next) {
  await store.dispatch('signOut');
  next(landing.path);
}

export default {
  path: '/signout',
  beforeEnter,
};
