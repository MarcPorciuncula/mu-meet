import Meet from '@/components/Meet';
import ProfileBadge from '@/components/ProfileBadge';
import store from '@/store';
import dashboard from './dashboard';

function beforeEnter(to, from, next) {
  if (to.fullpath === '/meet') {
    next(dashboard.path);
  } else {
    next();
  }
}

async function beforeEnterNew(to, from, next) {
  console.log('creating session');
  await store.dispatch('createMeetSession');
  console.log(store.state.meet.session.id);
  next(`/meet/${store.state.meet.session.id}`);
}

async function beforeEnterSession(to, from, next) {
  if (!store.getters.isInSession) {
    await store.dispatch('refreshMeetSession');
  }

  if (!store.getters.isInSession) {
    next(dashboard.path);
  } else {
    // FIXME handle if the user inputs the wrong meeting id
    if (!Object.values(store.state.calendars).length) {
      await store.dispatch('fetchCalendars');
    }
    next();
  }
}

export default {
  path: '/meet',
  meta: { shell: true, requiresAuth: true },
  components: {
    default: { template: '<router-view/>' },
    'app-bar-control': ProfileBadge,
  },
  beforeEnter,
  children: [
    {
      path: 'new',
      beforeEnter: beforeEnterNew,
    },
    {
      path: ':code',
      components: {
        default: Meet,
        'app-bar-control': ProfileBadge,
      },
      beforeEnter: beforeEnterSession,
      meta: { shell: true },
    },
  ],
};
