import Dashboard from '@/components/dashboard';
import ProfileBadge from '@/components/ProfileBadge';

export default {
  path: '/dashboard',
  components: {
    default: Dashboard,
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true },
};
