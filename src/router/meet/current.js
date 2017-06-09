import Meet from '@/components/Meet';
import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';

async function beforeEnter(to, from, next) {
  if (!store.getters.isInSession) {
    await store.dispatch('refreshMeetSession');
  }
  if (store.state.meet.session.id !== to.params.code) {
    await store.dispatch('joinMeetSession', to.params.code);
  }
  if (!Object.values(store.state.calendars).length) {
    await store.dispatch('fetchCalendars');
  }
  next();
}

export default {
  path: ':code',
  name: 'meet-current-session',
  components: {
    default: Meet,
    'app-bar-control': ProfileBadge,
  },
  beforeEnter: beforeEnter,
  meta: { shell: true },
};
