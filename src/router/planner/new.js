import store from '@/store';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { CREATE_PLANNER_SESSION } from '@/store/actions';
import current from './current';

async function beforeEnter(to, from, next) {
  await store.dispatch(CREATE_PLANNER_SESSION);
  next({ name: current.name, params: { code: store.getters[CURRENT_PLANNER_SESSION].id } });
}

export default {
  path: 'new',
  name: 'meet-new-session',
  beforeEnter: beforeEnter,
};
