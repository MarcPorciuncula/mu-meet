<template>
  <div>
    <MdcSelect
      label="Hr"
      :value="hour.toString()"
      :items="hours"
      @change="changeHour(parseInt($event))"
    />
    :
    <MdcSelect
      label="Min"
      :value="minute.toString()"
      :items="minutes"
      @change="changeMinute(parseInt($event))"
    />
    <MdcSelect
      label="Per."
      :value="offset.toString()"
      :items="offsets"
      @change="changeOffset(parseInt($event))"
    />
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import { range } from 'ramda';
import MdcSelect from '@/components/Material/Select';

export default {
  name: 'PlannerParametersTimeSelect',
  props: {
    value: VueTypes.number /* millseconds */,
  },
  components: {
    MdcSelect,
  },
  computed: {
    hours() {
      return range(1, 13).map(n => ({
        value: (n === 12 ? 0 : n).toString(),
        text: n.toString(),
      }));
    },
    minutes() {
      return range(0, 60 / 30)
        .map(n => n * 30)
        .map(n => ({
          value: n.toString(),
          text: n.toString().padStart(2, '0'),
        }));
    },
    offsets() {
      return [
        { value: (0).toString(), text: 'am' },
        { value: (12 * 60 * 60 * 1000).toString(), text: 'pm' },
      ];
    },
    hour() {
      return (
        (this.value % (12 * 60 * 60 * 1000) - this.value % (60 * 60 * 1000)) /
        (60 * 60 * 1000)
      );
    },
    minute() {
      return (this.value % (60 * 60 * 1000)) / (60 * 1000);
    },
    offset() {
      return this.value - this.value % (12 * 60 * 60 * 1000);
    },
  },
  methods: {
    changeHour(hour) {
      const value = this.value + (hour - this.hour) * 60 * 60 * 1000;
      this.$emit('change', value);
    },
    changeMinute(minute) {
      const value = this.value + (minute - this.minute) * 60 * 1000;
      this.$emit('change', value);
    },
    changeOffset(offset) {
      const value = this.value + (offset - this.offset);
      this.$emit('change', value);
    },
  },
};
</script>
