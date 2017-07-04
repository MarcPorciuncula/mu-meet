import R from 'ramda';
import addSeconds from 'date-fns/add_seconds';
import parse from 'date-fns/parse';
import MeetingTimes from './MeetingTimes';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';

export default {
  name: 'ConnectedMeetingTimes',
  render(h) {
    return h(MeetingTimes, { props: { meetings: this.meetings } });
  },
  computed: {
    meetings() {
      const session = this.$store.getters[CURRENT_PLANNER_SESSION];
      return R.compose(
        // The 'end' is at 1 second before the start of the next timeslot
        R.map(
          R.evolve({ start: parse, end: date => addSeconds(parse(date), 1) }),
        ),
        R.defaultTo([]),
        R.path(['result', 'meetings']),
      )(session);
    },
  },
};
