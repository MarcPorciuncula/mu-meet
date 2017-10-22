import dashboard from './dashboard';
import calendars from './calendars';
import RouterView from '@/router/RouterView';
const ProfileBadge = () => import('@/views/ProfileBadge');

export default {
  path: 'my',
  components: {
    default: RouterView,
    'header-bar-control': ProfileBadge,
  },
  children: [dashboard, calendars],
  meta: { requiresAuth: true },
};
