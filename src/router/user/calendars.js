const Calendars = () => import('@/views/Calendars');
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
  path: 'calendars',
  name: 'calendars',
  components: {
    default: Calendars,
  },
  meta: { title: 'My Calendars' },
  beforeEnter,
};
