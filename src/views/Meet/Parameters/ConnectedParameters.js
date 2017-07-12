import { mapGetters } from 'vuex';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { SET_PLANNER_CONFIG } from '@/store/actions';
import addSeconds from 'date-fns/add_seconds';
import addDays from 'date-fns/add_days';
import Parameters from './Parameters';
import { omit } from 'ramda';

export default {
  props: omit(['startDate', 'endDate'], Parameters.props),
  render(h) {
    return h(Parameters, {
      props: {
        startDate: this.config.searchFromDate,
        endDate: this.config.searchToDate,
        done: this.done,
      },
      on: {
        'start-date-changed': event => {
          this.$store.dispatch(SET_PLANNER_CONFIG, { searchFromDate: event });
        },
        'end-date-changed': event => {
          this.$store.dispatch(SET_PLANNER_CONFIG, {
            searchToDate: addSeconds(addDays(event, 1), -1),
          });
        },
      },
    });
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
    config() {
      return this.session.config;
    },
  },
};
