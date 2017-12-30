import store from '@/store';
import {
  SUBSCRIBE_PLANNER_SESSION,
  FETCH_PLANNER_SESSIONS,
} from '@/store/actions';
const Dashboard = () => import('@/views/Dashboard');

async function beforeEnter(to, from, next) {
  store.dispatch(SUBSCRIBE_PLANNER_SESSION);
  store.dispatch(FETCH_PLANNER_SESSIONS);
  next();
}

export default {
  name: 'dashboard',
  path: 'dashboard',
  component: Dashboard,
  meta: { title: 'Dashboard' },
  beforeEnter,
};
