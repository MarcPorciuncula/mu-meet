<template>
  <div>
    <div class="flex flex-column items-center">
      <div class="mw8 w-100 mt4-ns ph3">
        <p class="f5 lh-copy measure-narrow">
          Currently searching for at least 30 min
          from {{ session.config.searchFromHour | formatHour }}
          to {{ session.config.searchToHour | formatHour }}
          on weekdays,
          over {{ session.config.searchFromDate | format('ddd DD MMM') }}
          to {{ session.config.searchToDate | format('ddd DD MMM') }}.
        </p>
      </div>
      <div class="mw6 w-100 ph3">
        <h3 class="f5 fw5 lh-title">
          Parameters
        </h3>
        <div
          v-if="uid === session.host"
        >
          <h4 class="f6 lh-copy fw4 mt0">
            Date range
          </h4>
          <DateRangeSelect
            :start="session.config.searchFromDate"
            :end="session.config.searchToDate"
            @change="changeDateRange($event)"
          />
          <h4 class="f6 lh-copy fw4">
            Time range
          </h4>
          <TimeRangeSelect
            :start="session.config.searchFromHour * 60 * 60 * 1000"
            :end="session.config.searchToHour * 60 * 60 * 1000"
            @change="changeTimeRange($event)"
          />
        </div>
        <div v-else>
          <p class="f6 lh-copy grey-600">
            Meeting parameters are controlled by the host of the meeting plan, {{ session.users.find(u => u.uid === session.host).name }}.
          </p>
        </div>
        <h3 class="f5 fw5 lh-title">
          Other
        </h3>
        <div>
          <button
            class="f6 bn bg-transparent di lh-copy sans pa0 action grey-300"
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
            class="f6 lh-copy grey-300"
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
import { mapGetters } from 'vuex';
import DateRangeSelect from './DateRangeSelect';
import TimeRangeSelect from './TimeRangeSelect';
import format from 'date-fns/format';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import { SET_PLANNER_CONFIG, ARCHIVE_PLANNER_SESSION } from '@/store/actions';
import { USER_UID } from '@/store/getters';

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
    ...mapGetters({
      uid: USER_UID,
    }),
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
