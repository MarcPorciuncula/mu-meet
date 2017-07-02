import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';
import {
  IS_SUBSCRIBED_CALENDARS,
  IS_SUBSCRIBED_PLANNER_SESSION,
} from '@/store/getters';
import {
  SUBSCRIBE_CALENDARS,
  SUBSCRIBE_PLANNER_SESSION,
} from '@/store/actions';

async function beforeEnter(to, from, next) {
  if (!store.getters[IS_SUBSCRIBED_PLANNER_SESSION]) {
    await store.dispatch(SUBSCRIBE_PLANNER_SESSION);
  }
  if (store.state.meet.session.id !== to.params.code) {
    await store.dispatch('joinMeetSession', to.params.code);
  }
  if (!store.getters[IS_SUBSCRIBED_CALENDARS]) {
    await store.dispatch(SUBSCRIBE_CALENDARS);
  }
  next();
}

export default {
  path: ':code',
  name: 'meet-current-session',
  components: {
    default: () => import('@/components/Meet').then(exports => exports.default),
    'app-bar-control': ProfileBadge,
  },
  beforeEnter: beforeEnter,
  meta: { shell: true, title: 'Meeting Planner' },
};
