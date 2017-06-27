import R from 'ramda';
import { mapState } from 'vuex';
import addSeconds from 'date-fns/add_seconds';
import MeetingTimes from './MeetingTimes';

export default {
  name: 'ConnectedMeetingTimes',
  render(h) {
    return h(MeetingTimes, { props: { meetings: this.meetings } });
  },
  computed: mapState({
    meetings: R.compose(
      // The 'end' is at 1 second before the start of the next timeslot
      R.map(R.evolve({ end: date => addSeconds(date, 1) })),
      R.defaultTo([]),
      R.path(['meet', 'session', 'result', 'meetings']),
    ),
  }),
};
