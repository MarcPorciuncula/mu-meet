import R from 'ramda';
import Dashboard from './Dashboard';
import calendarsRoute from '@/router/user/calendars';
import meetingPlanRoute from '@/router/planner/current';
import newMeetingPlanRoute from '@/router/planner/new';
import { CURRENT_PLANNER_SESSION, USER_UID } from '@/store/getters';
import { ARCHIVE_PLANNER_SESSION } from '@/store/actions';

export default {
  name: 'ConnectedDashboard',
  render(h) {
    return h(Dashboard, {
      props: R.pick([
        'meetingPlanRoute',
        'lastMeetingPlan',
        'actions',
        'archiveLastMeetingPlan',
      ])(this),
    });
  },
  computed: {
    meetingPlanRoute: R.always(meetingPlanRoute),
    lastMeetingPlan() {
      const session = this.$store.getters[CURRENT_PLANNER_SESSION];
      if (session) {
        return Object.assign({}, session, {
          users: session.users.filter(
            user => user.id !== this.$store.getters[USER_UID],
          ),
        });
      }
      return null;
    },
    actions() {
      return [
        { text: 'Start a meeting plan', route: newMeetingPlanRoute },
        // { text: 'Join a meeting plan' },
        null,
        { text: 'My calendars', route: calendarsRoute },
        // { text: 'Past meeting plans' },
      ];
    },
  },
  methods: {
    async archiveLastMeetingPlan() {
      await this.$store.dispatch(ARCHIVE_PLANNER_SESSION);
    },
  },
};
