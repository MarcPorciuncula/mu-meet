const Calendars = () => import('@/views/Calendars');
import { FETCH_CALENDARS } from '@/store/actions';
import store from '@/store';

async function beforeEnter(to, from, next) {
  await store.dispatch(FETCH_CALENDARS, { progress: true });
  next();
}

export default {
  path: 'calendars',
  name: 'calendars',
  components: {
    default: Calendars,
  },
  meta: { title: 'My Calendars' },
  beforeEnter,
};
