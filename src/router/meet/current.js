import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';
import { IS_SUBSCRIBED_CALENDARS } from '@/store/getters';
import { SUBSCRIBE_CALENDARS } from '@/store/actions';

async function beforeEnter(to, from, next) {
  if (!store.getters.isInSession) {
    await store.dispatch('refreshMeetSession');
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
