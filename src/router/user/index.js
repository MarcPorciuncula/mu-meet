const ProfileBadge = () => import('@/views/ProfileBadge');
import dashboard from './dashboard';
import calendars from './calendars';
import RouterView from '@/router/RouterView';

export default {
  path: 'my',
  components: {
    default: RouterView,
    'header-bar-control': ProfileBadge,
  },
  children: [dashboard, calendars],
  meta: { requiresAuth: true },
};
