const Planner = () => import('@/views/Planner');
import store from '@/store';
import PlannerAPI from '@/api/planner';
import { USER_UID } from '@/store/getters';
import {
  FETCH_CALENDARS,
  SUBSCRIBE_PLANNER_SESSION,
  JOIN_PLANNER_SESSION,
} from '@/store/actions';

async function beforeEnter(to, from, next) {
  if (
    !await PlannerAPI.hasAccess({
      uid: store.getters[USER_UID],
      id: to.params.code,
    })
  ) {
    await store.dispatch(JOIN_PLANNER_SESSION, { id: to.params.code });
  }
  await store.dispatch(SUBSCRIBE_PLANNER_SESSION);
  await store.dispatch(FETCH_CALENDARS, { progress: false });
  next();
}

export default {
  path: ':code',
  name: 'planner-current',
  components: {
    default: Planner,
  },
  beforeEnter: beforeEnter,
  meta: { title: 'Meeting Planner' },
};
