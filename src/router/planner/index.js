const ProfileBadge = () => import('@/views/ProfileBadge');
import RouterView from '@/router/RouterView';
import dashboard from '@/router/user/dashboard';
import newSession from './new';
import currentSession from './current';

function beforeEnter(to, from, next) {
  if (to.name === 'planner-root') {
    next(dashboard.path);
  } else {
    next();
  }
}

export default {
  name: 'planner-root',
  path: '/plan',
  meta: { requiresAuth: true },
  components: {
    default: RouterView,
    'header-bar-control': ProfileBadge,
  },
  beforeEnter,
  children: [newSession, currentSession],
};
