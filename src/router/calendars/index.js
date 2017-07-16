const Calendars = () => import('@/views/Calendars');
const ProfileBadge = () => import('@/views/ProfileBadge');
import { IS_SUBSCRIBED_CALENDARS } from '@/store/getters';
import { SUBSCRIBE_CALENDARS } from '@/store/actions';
import store from '@/store';

async function beforeEnter(to, from, next) {
  if (!store.getters[IS_SUBSCRIBED_CALENDARS]) {
    await store.dispatch(SUBSCRIBE_CALENDARS);
  }
  next();
}

export default {
  path: '/calendars',
  name: 'SelectCalendars',
  components: {
    default: Calendars,
    'header-bar-control': ProfileBadge,
  },
  meta: { requiresAuth: true, title: 'My Calendars' },
  beforeEnter,
};
