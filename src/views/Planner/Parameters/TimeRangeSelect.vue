<template>
  <div>
    <TimeSelect
      :value="start"
      @change="changeStart($event)"
    />
    <TimeSelect
      :value="end"
      @change="changeEnd($event)"
    />
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import TimeSelect from './TimeSelect';

export default {
  name: 'PlannerParametersTimeRangeSelect',
  components: {
    TimeSelect,
  },
  props: {
    start: VueTypes.number,
    end: VueTypes.number,
  },
  methods: {
    changeStart(start) {
      this.$emit('change', { start, end: this.end });
    },
    changeEnd(end) {
      this.$emit('change', { start: this.start, end });
    },
  },
};
</script>
