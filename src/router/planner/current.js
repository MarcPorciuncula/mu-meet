const Meet = () => import('@/views/Meet');
import store from '@/store';
import {
  IS_SUBSCRIBED_CALENDARS,
  IS_SUBSCRIBED_PLANNER_SESSION,
  CURRENT_PLANNER_SESSION,
} from '@/store/getters';
import {
  SUBSCRIBE_CALENDARS,
  SUBSCRIBE_PLANNER_SESSION,
  JOIN_PLANNER_SESSION,
} from '@/store/actions';

async function beforeEnter(to, from, next) {
  if (!store.getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
    await store.dispatch(SUBSCRIBE_PLANNER_SESSION);
  }
  const session = store.getters[CURRENT_PLANNER_SESSION];
  if (!session || session.id !== to.params.code) {
    await store.dispatch(JOIN_PLANNER_SESSION, { id: to.params.code });
  }
  if (!store.getters[IS_SUBSCRIBED_CALENDARS]) {
    await store.dispatch(SUBSCRIBE_CALENDARS);
  }
  next();
}

export default {
  path: ':code',
  name: 'planner-current',
  components: {
    default: Meet,
  },
  beforeEnter: beforeEnter,
  meta: { title: 'Meeting Planner' },
};