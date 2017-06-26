// import { mapState } from 'vuex';
import R from 'ramda';
import Dashboard from './Dashboard';
import store from '@/store';
import calendars from '@/router/calendars';

export default {
  name: 'ConnectedDashboard',
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('refreshMeetSession');
    next();
  },
  render(h) {
    return h(Dashboard, {
      props: {
        lastMeetingPlan: this.lastMeetingPlan,
        actions: this.actions,
      },
    });
  },
  computed: {
    lastMeetingPlan() {
      if (store.getters.isInSession) {
        return {
          startedAt: new Date(store.state.meet.session.startedAt),
          users: R.compose(
            R.mapObjIndexed((value, key) => store.state.users.users[key]),
            R.pickBy((value, key) => key !== store.getters.authUid),
          )(store.state.meet.session.users),
        };
      }
      return null;
    },
    actions() {
      return [
        { text: 'Start a meeting plan' },
        { text: 'Join a meeting plan' },
        null,
        { text: 'My calendars', route: calendars },
        { text: 'Past meeting plans' },
      ];
    },
  },
};
