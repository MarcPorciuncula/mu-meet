<template>
  <div>
    <mdc-list-group-header>
      Date Range
    </mdc-list-group-header>
    <mdc-list multiline @click="">
      <mdc-list-item>
        <span slot="start-detail" class="material-icons">
          date_range
        </span>
        <div class="date-range-control__field">
          <mdc-select
            :items="options"
            :value="value"
            @change="emit($event)"
          />
        </div>
      </mdc-list-item>
      <mdc-list-item class="date-range-control__dates">
        <span slot="start-detail" />
        {{ start | format('ddd DD MMM') }} to {{ end | format('ddd DD MMM') }}
      </mdc-list-item>
    </mdc-list>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import isEqual from 'date-fns/is_equal';
import format from 'date-fns/format';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import setMilliseconds from 'date-fns/set_milliseconds';
import addDays from 'date-fns/add_days';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroupHeader as MdcListGroupHeader,
} from '@/components/Material/List';
import MdcSelect from '@/components/Material/Select';

const THIS_WEEK = 'THIS_WEEK';
const NEXT_WEEK = 'NEXT_WEEK';
const WEEK_AFTER = 'WEEK_AFTER';
const CUSTOM = 'CUSTOM';

export default {
  props: {
    start: VueTypes.oneOfType([Date]),
    end: VueTypes.oneOfType([Date]),
  },
  components: {
    MdcList,
    MdcListItem,
    MdcListGroupHeader,
    MdcSelect,
  },
  computed: {
    options() {
      const result = [
        { value: THIS_WEEK, text: 'this week' },
        { value: NEXT_WEEK, text: 'next week' },
        { value: WEEK_AFTER, text: 'the week after' },
      ];
      if (this.value === CUSTOM) {
        result.push({ value: CUSTOM, text: 'custom', disabled: true });
      }
      return result;
    },
  },
  data() {
    return {
      value: CUSTOM,
    };
  },
  created() {
    this.update();
  },
  methods: {
    emit(value) {
      let start = getStartOfWeek(new Date());

      switch (value) {
        case NEXT_WEEK:
          start = addDays(start, 7);
          break;
        case WEEK_AFTER:
          start = addDays(start, 14);
          break;
        case THIS_WEEK:
        default:
          break;
      }

      const end = getEndOfWeek(start);
      this.$emit('start-change', start);
      this.$emit('end-change', end);
    },
    dates(value) {
      let start = getStartOfWeek(new Date());

      switch (value) {
        case THIS_WEEK:
          break;
        case NEXT_WEEK:
          start = addDays(start, 7);
          break;
        case WEEK_AFTER:
          start = addDays(start, 14);
          break;
        case CUSTOM:
          return { start: this.start, end: this.end };
        default:
          break;
      }

      const end = setMilliseconds(getEndOfWeek(start), 0);

      return { start, end };
    },
    update() {
      for (const value of [THIS_WEEK, NEXT_WEEK, WEEK_AFTER, CUSTOM]) {
        const { start, end } = this.dates(value);
        if (isEqual(this.start, start) && isEqual(this.end, end)) {
          this.value = value;
          return;
        }
      }
    },
  },
  watch: {
    start() {
      this.update();
    },
    end() {
      this.update();
    },
  },
  filters: {
    format,
  },
};
</script>

<style scoped lang="scss">
.date-range-control__field {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: -0.25rem;
}

.date-range-control__dates {
  color: #757575;
}
</style>
