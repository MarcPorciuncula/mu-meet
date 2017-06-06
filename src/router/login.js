import SignIn from '@/components/SignIn';
import dashboard from '@/router/dashboard';
import store from '@/store';

async function beforeEnter(to, from, next) {
  if (store.state.auth.isSignedIn) {
    next(dashboard.path);
  } else {
    next();
  }
}

export default {
  path: '/login',
  component: SignIn,
  meta: { shell: true },
  beforeEnter,
};
