import SignIn from '@/components/SignIn';
import ProfileBadge from '@/components/ProfileBadge';
import dashboard from '@/router/dashboard';
import store from '@/store';
import { IS_SIGNED_IN } from '@/store/getters';

async function beforeEnter(to, from, next) {
  if (store.getters[IS_SIGNED_IN]) {
    next(dashboard.path);
  } else {
    next();
  }
}

export default {
  path: '/signin',
  components: {
    default: SignIn,
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true, title: 'Sign in' },
  beforeEnter,
};
