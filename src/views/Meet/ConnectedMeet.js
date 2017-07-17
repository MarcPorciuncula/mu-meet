import R from 'ramda';
import calendarsRoute from '@/router/calendars';
import dashboardRoute from '@/router/dashboard';
import Meet from './Meet';
import { SELECTED_CALENDARS, CURRENT_PLANNER_SESSION } from '@/store/getters';
import {
  ARCHIVE_PLANNER_SESSION,
  REQUEST_PLANNER_RESULT,
} from '@/store/actions';

export default {
  name: 'ConnectedMeet',
  render(h) {
    if (this.session) {
      return h(Meet, {
        props: R.pick([
          'inviteLink',
          'calendars',
          'calendarsRoute',
          'findMeetingTimes',
          'archive',
          'session',
        ])(this),
      });
    } else {
      return null;
    }
  },
  computed: {
    inviteLink() {
      return (
        location.origin +
        (this.$router.mode === 'hash' ? '/#' : '') +
        this.$route.fullPath
      );
    },
    calendarsRoute: R.always(calendarsRoute),
    calendars() {
      return Object.values(this.$store.getters[SELECTED_CALENDARS]);
    },
    session() {
      return this.$store.getters[CURRENT_PLANNER_SESSION];
    },
  },
  methods: {
    async findMeetingTimes() {
      await this.$store.dispatch(REQUEST_PLANNER_RESULT);
    },
    async archive() {
      await this.$store.dispatch(ARCHIVE_PLANNER_SESSION);
      await this.$router.push({ name: dashboardRoute.name });
    },
  },
};
