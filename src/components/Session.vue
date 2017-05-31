<template>
  <router-view></router-view>
</template>

<script>
import Page from './Page';
import invariant from 'invariant';
import {
  PHASE_LOBBY,
  PHASE_CONFIGURE,
  PHASE_RESULT,
  PHASE_ARCHIVED,
} from '@/store/modules/scheduling';
import store from '@/store';

export default {
  components: {
    Page,
  },
  async beforeRouteEnter(to, from, next) {
    if (!store.state.auth.isSignedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else if (!store.state.calendar.selected) {
      next({ path: '/calendars', query: { redirect: to.fullPath } });
    } else {
      await store.dispatch('refreshSchedulingSessionStatus');
      if (
        store.state.scheduling.isInSession &&
        !store.state.scheduling.subscription.isSubscribed
      ) {
        await store.dispatch('subscribeSchedulingSessionStatus');
      }
      redirectToSessionSubroute(to, from, next);
    }
  },
  async beforeRouteUpdate(to, from, next) {
    redirectToSessionSubroute(to, from, next);
  },
};

function redirectToSessionSubroute(to, from, next) {
  if (to.path !== '/session') {
    next();
    return;
  }
  if (!store.state.scheduling.isInSession) {
    next({ path: '/session/setup', query: to.query });
  } else {
    const id = store.state.scheduling.session.id;
    switch (store.state.scheduling.session.phase) {
      case PHASE_LOBBY:
        next({ path: '/session/lobby', query: { id } });
        break;
      case PHASE_CONFIGURE:
        next({ path: '/session/confirm', query: { id } });
        break;
      case PHASE_RESULT:
        next({ path: '/session/result', query: { id } });
        break;
      case PHASE_ARCHIVED:
        next({ path: '/session/setup' });
        break;
      default:
        invariant(
          false,
          `Unknown phase type ${store.state.scheduling.session.phase}`,
        );
    }
  }
  store.dispatch('removeProgressItem', 'ROUTE_TRANSITION');
}
</script>

<style>

</style>
