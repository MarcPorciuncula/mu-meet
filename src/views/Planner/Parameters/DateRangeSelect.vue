<template>
  <MdcSelect
    label="Date range"
    :items="options"
    :value="start.toISOString() + '|' + end.toISOString()"
    @change="handleChange($event)"
  />
</template>

<script>
import VueTypes from 'vue-types';
import MdcSelect from '@/components/Material/Select';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import setMilliseconds from 'date-fns/set_milliseconds';
import addDays from 'date-fns/add_days';
import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';
import parse from 'date-fns/parse';

export default {
  name: 'PlannerParametersDateRangeSelect',
  components: {
    MdcSelect,
  },
  props: {
    start: VueTypes.oneOfType([Date]),
    end: VueTypes.oneOfType([Date]),
  },
  computed: {
    options() {
      const startOfWeek = getStartOfWeek(new Date());

      const offsets = [-1, 0, 1, 2];
      const labels = ['Last week', 'This week', 'Next week', 'The week after'];
      const starts = offsets.map(offset => addDays(startOfWeek, 7 * offset));
      const ends = starts.map(start => setMilliseconds(getEndOfWeek(start), 0));

      const options = starts.map((start, i) => {
        const end = ends[i];
        return {
          value: start.toISOString() + '|' + end.toISOString(),
          text: `${labels[i]} (${format(start, 'DD MMM')} to ${format(
            end,
            'DD MMM',
          )})`,
        };
      });

      if (!starts.find(start => isEqual(this.start, start))) {
        options.push({
          value: this.start.toISOString() + '|' + this.end.toISOString(),
          text: `${format(this.start, 'DD MMM')} to ${format(
            this.end,
            'DD MMM',
          )}`,
        });
      }

      return options;
    },
  },
  methods: {
    handleChange(value) {
      const [start, end] = value
        .match(/^(.*)\|(.*)$/)
        .slice(1)
        .map(parse);

      this.$emit('change', { start, end });
    },
  },
};
</script>
