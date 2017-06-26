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
    default: () =>
      import('@/components/Dashboard').then(exports => exports.default),
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true, title: 'Dashboard' },
  beforeEnter,
};
