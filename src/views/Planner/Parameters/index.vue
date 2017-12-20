<template>
  <div>
    <div class="bg-white flex flex-column items-center">
      <div class="mw8 w-100 mt4-ns mb3 pa3 pb6">
        <h2 class="f3 fw5 lh-title mt0">Change parameters</h2>
        <p class="f5 lh-copy grey-600 measure-narrow">
          At least 30 min
          from {{ session.config.searchFromHour | formatHour }}
          to {{ session.config.searchToHour | formatHour }}
          on weekdays,
          over {{ session.config.searchFromDate | format('ddd DD MMM') }}
          to {{ session.config.searchToDate | format('ddd DD MMM') }}.
        </p>
      </div>
    </div>
    <div class="flex flex-column items-center mtn6 mb4">
      <div class="mw6 w-100 pa3">
        <h3 class="f6 fw5 grey-600 lh-title">
          Parameters
        </h3>
        <div class="bg-white br2 br--bottom elevate1 mb3 pa3">
          <h4 class="f6 lh-copy fw4 grey-700 mt0">
            Date range
          </h4>
          <DateRangeSelect
            :start="session.config.searchFromDate"
            :end="session.config.searchToDate"
            @change="changeDateRange($event)"
          />
          <h4 class="f6 lh-copy fw4 grey-700">
            Time range
          </h4>
          <TimeRangeSelect
            :start="session.config.searchFromHour * 60 * 60 * 1000"
            :end="session.config.searchToHour * 60 * 60 * 1000"
            @change="changeTimeRange($event)"
          />
        </div>
        <h3 class="f6 fw5 grey-600 lh-title">
          Other options
        </h3>
        <div>
          <button
            class="f5 bn bg-transparent di lh-copy sans pa0 action grey-900"
            @click="archive()"
          >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              archive
            </span>
            <span class="bb">
              Archive meeting plan
            </span>
          </button>
          <p class="f6 grey-600 lh-copy measure mt">
            Archived meeting plans are automatically deleted after two weeks.
          </p>
          <router-link
            :to="{ path: '/my/dashboard' }"
            class="f5 lh-copy"
          >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              chevron_left
            </span>
            <span class="bb">
              Return to dashboard
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeSelect from './DateRangeSelect';
import TimeRangeSelect from './TimeRangeSelect';
import format from 'date-fns/format';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import { SET_PLANNER_CONFIG, ARCHIVE_PLANNER_SESSION } from '@/store/actions';

export default {
  name: 'PlannerParameters',
  props: {
    session: {},
  },
  components: {
    DateRangeSelect,
    TimeRangeSelect,
  },
  computed: {
    config() {
      return this.session.config;
    },
  },
  methods: {
    changeDateRange({ start, end }) {
      this.$store.dispatch(SET_PLANNER_CONFIG, {
        searchFromDate: start,
        searchToDate: end,
      });
    },
    changeTimeRange({ start, end }) {
      this.$store.dispatch(SET_PLANNER_CONFIG, {
        searchFromHour: start / (60 * 60 * 1000),
        searchToHour: end / (60 * 60 * 1000),
      });
    },
    archive() {
      this.$store.dispatch(ARCHIVE_PLANNER_SESSION);
      this.$router.push({ name: 'dashboard' });
    },
  },
  filters: {
    format,
    formatHour(hours) {
      const minutes = (hours % 1) * 60;
      let date = new Date();
      date = setMinutes(date, minutes);
      date = setHours(date, hours);
      return format(date, 'h:mma');
    },
  },
};
</script>
