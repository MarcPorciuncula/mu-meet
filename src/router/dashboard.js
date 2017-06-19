import Dashboard from '@/components/Dashboard2';
import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';

async function beforeEnter(to, from, next) {
  await store.dispatch('refreshMeetSession');
  next();
}

export default {
  name: 'dashboard',
  path: '/dashboard',
  components: {
    default: Dashboard,
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true, title: 'Dashboard' },
  beforeEnter,
};
