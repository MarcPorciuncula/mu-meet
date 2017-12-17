import dashboard from '@/router/user/dashboard';
import store from '@/store';
import { IS_SIGNED_IN } from '@/store/getters';
const SignIn = () => import('@/views/SignIn');

async function beforeEnter(to, from, next) {
  if (store.getters[IS_SIGNED_IN]) {
    next({ name: dashboard.name });
  } else {
    next();
  }
}

export default {
  name: 'signin',
  path: '/signin',
  component: SignIn,
  meta: { title: 'Sign in' },
  beforeEnter,
};
