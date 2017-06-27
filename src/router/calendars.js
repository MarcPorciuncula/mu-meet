import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';

async function beforeEnter(to, from, next) {
  if (!Object.keys(store.state.calendars).length) {
    await store.dispatch('fetchCalendars');
  }
  next();
}

export default {
  path: '/calendars',
  name: 'SelectCalendars',
  components: {
    default: () => import('@/components/SelectCalendars'),
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true, requiresAuth: true, title: 'My Calendars' },
  beforeEnter,
};
