import store from '@/store';

async function beforeEnter(to, from, next) {
  await store.dispatch('createMeetSession');
  next(`/meet/${store.state.meet.session.id}`);
}

export default {
  path: 'new',
  name: 'meet-new-session',
  beforeEnter: beforeEnter,
};
