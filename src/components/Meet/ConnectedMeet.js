import { mapState } from 'vuex';
import R from 'ramda';
import calendarsRoute from '@/router/calendars';
import Meet from './Meet';

export default {
  name: 'ConnectedMeet',
  render(h) {
    return h(Meet, {
      props: R.pick(
        ['inviteLink', 'calendars', 'calendarsRoute', 'findMeetingTimes'],
        this,
      ),
    });
  },
  computed: {
    inviteLink: R.always(location.href),
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
  },
};
