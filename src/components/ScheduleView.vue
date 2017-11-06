<template>
  <div class="schedule-view">
    <div class="schedule-view_aside">
      <day-picker
        :start="start"
        :end="end"
        :selected="selected"
        @change="selected = $event"
      />
    </div>
    <div class="schedule-view_main">
      <day-view :events="day" />
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import DayPicker from '@/components/DayPicker';
import DayView from '@/components/DayView';
import Time from '@/util/Time';
import { prop, evolve } from 'ramda';
import max from 'date-fns/max';
import min from 'date-fns/min';
import getHours from 'date-fns/get_hours';
import getMinutes from 'date-fns/get_minutes';
import isEqual from 'date-fns/is_equal';
import getStartOfDay from 'date-fns/start_of_day';

export default {
  components: {
    DayPicker,
    DayView,
  },
  props: {
    events: VueTypes.arrayOf(
      VueTypes.shape({
        start: VueTypes.instanceOf(Date).isRequired,
        end: VueTypes.instanceOf(Date).isRequired,
        summary: VueTypes.string.isRequired,
        color: {} /* nullable string */,
      }).isRequired,
    ).isRequired,
  },
  data() {
    return {
      selected: null,
    };
  },
  created() {
    this.selected = getStartOfDay(this.events[0].start);
  },
  computed: {
    start() {
      return this.events.map(prop('start')).reduce((a, b) => min(a, b));
    },
    end() {
      return this.events.map(prop('end')).reduce((a, b) => max(a, b));
    },
    day() {
      return this.events
        .filter(event => isEqual(getStartOfDay(event.start), this.selected))
        .map(evolve({ start: this.toTime, end: this.toTime }));
    },
  },
  methods: {
    toTime(date) {
      return new Time(getHours(date) * 60 + getMinutes(date), 'm');
    },
  },
};
</script>

<style scoped lang="scss">
.schedule-view {
  width: 100%;
  display: flex;
  flex-direction: row;
  max-height: 78vh;
}

.schedule-view_aside {
  padding: 1rem 0;
  overflow-y: scroll;
}

.schedule-view_main {
  flex-grow: 1;
  overflow: scroll;
}
</style>
