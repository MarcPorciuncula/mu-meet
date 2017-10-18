import { FETCH_CALENDARS } from '@/store/actions';
import store from '@/store';
const Calendars = () => import('@/views/Calendars');

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
