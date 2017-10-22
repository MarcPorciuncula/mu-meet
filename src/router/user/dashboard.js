import store from '@/store';
import { SUBSCRIBE_PLANNER_SESSION } from '@/store/actions';
const Dashboard = () => import('@/views/Dashboard');

async function beforeEnter(to, from, next) {
  store.dispatch(SUBSCRIBE_PLANNER_SESSION);
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
