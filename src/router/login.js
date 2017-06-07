import SignIn from '@/components/SignIn';
import ProfileBadge from '@/components/ProfileBadge';
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
  components: {
    default: SignIn,
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true },
  beforeEnter,
};
