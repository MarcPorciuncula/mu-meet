const Dashboard = () => import('@/views/Dashboard');
import store from '@/store';
import { IS_SUBSCRIBED_PLANNER_SESSION } from '@/store/getters';
import { SUBSCRIBE_PLANNER_SESSION } from '@/store/actions';

async function beforeEnter(to, from, next) {
  if (!store.getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
    await store.dispatch(SUBSCRIBE_PLANNER_SESSION);
  }
  next();
}

export default {
  name: 'dashboard',
  path: 'dashboard',
  components: {
    default: Dashboard,
  },
  meta: { title: 'Dashboard' },
  beforeEnter,
};
