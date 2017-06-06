import Dashboard from '@/components/dashboard';
import store from '@/store';
import login from '@/router/login';

function beforeEnter(to, from, next) {
  if (!store.state.auth.isSignedIn) {
    next(login.path);
  } else {
    next();
  }
}

export default {
  path: '/dashboard',
  component: Dashboard,
  meta: { shell: true },
  beforeEnter,
};
