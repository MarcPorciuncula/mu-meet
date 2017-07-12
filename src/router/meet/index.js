import dashboard from '../dashboard';
import ProfileBadge from '@/views/ProfileBadge';
import newSession from './new';
import currentSession from './current';

function beforeEnter(to, from, next) {
  if (to.name === 'meet-root') {
    next(dashboard.path);
  } else {
    next();
  }
}

export default {
  name: 'meet-root',
  path: '/meet',
  meta: { requiresAuth: true },
  components: {
    default: { template: '<router-view/>' },
    'header-bar-control': ProfileBadge,
  },
  beforeEnter,
  children: [newSession, currentSession],
};
