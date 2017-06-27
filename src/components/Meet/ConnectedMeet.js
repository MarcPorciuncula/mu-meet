import { mapState } from 'vuex';
import R from 'ramda';
import calendarsRoute from '@/router/calendars';
import dashboardRoute from '@/router/dashboard';
import Meet from './Meet';

export default {
  name: 'ConnectedMeet',
  render(h) {
    return h(Meet, {
      props: R.pick([
        'inviteLink',
        'calendars',
        'calendarsRoute',
        'findMeetingTimes',
        'archive',
      ])(this),
    });
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
    ...mapState({
      calendars: state =>
        Object.values(state.calendars).filter(calendar => calendar.selected),
    }),
  },
  methods: {
    async findMeetingTimes() {
      await this.$store.dispatch('requestMeetResult');
    },
    async archive() {
      await this.$store.dispatch('archiveMeetSession');
      await this.$router.push({ name: dashboardRoute.name });
    },
  },
};
