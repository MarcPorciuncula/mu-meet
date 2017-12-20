<template>
  <mdc-list-group class="day-picker">
    <template v-for="month, key, index in months">
      <mdc-list-group-header :key="key">
        {{ month[0] | format('MMM') }}
      </mdc-list-group-header>
      <mdc-list dense :key="key" class="day-picker__month">
        <mdc-list-item
          v-for="day in month"
          @click="$emit('change', day)"
          :class="['day-picker__day pointer', {
            'day-picker__day--active': isEqual(day, selected),
          }]"
          :key="day.toString()"
        >
          <span>
            {{ day | format('DD') }}
            <span class="secondary">{{ day | format('ddd') }}</span>
          </span>
        </mdc-list-item>
      </mdc-list>
    </template>
  </mdc-list-group>
</template>

<script>
import VueTypes from 'vue-types';
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/List/Item';
import MdcListGroup from '@/components/Material/List/Group';
import MdcListGroupHeader from '@/components/Material/List/GroupHeader';
import format from 'date-fns/format';
import addHours from 'date-fns/add_hours';
import getEndOfDay from 'date-fns/end_of_day';
import getStartOfDay from 'date-fns/start_of_day';
import isBefore from 'date-fns/is_before';
import isEqual from 'date-fns/is_equal';
import { groupBy } from 'ramda';

export default {
  props: {
    start: VueTypes.instanceOf(Date),
    end: VueTypes.instanceOf(Date),
    selected: VueTypes.instanceOf(Date),
  },
  components: {
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupHeader,
  },
  computed: {
    days() {
      const start = getStartOfDay(this.start);
      const end = getEndOfDay(this.end);
      let current = start;
      const result = [];
      while (isBefore(current, end)) {
        result.push(current);
        current = addHours(current, 24);
      }
      return result;
    },
    months() {
      return groupBy(date => format(date, 'MM-YYYY'))(this.days);
    },
  },
  methods: {
    isEqual,
  },
  filters: {
    format,
  },
};
</script>

<style scoped lang="scss">
.day-picker__day /deep/ .mdc-list-item__text {
  border-left: 2px solid rgba(0, 0, 0, 0);
  padding-left: 0.5rem;
}

.day-picker__day--active /deep/ .mdc-list-item__text {
  border-left-color: #000;
}

.secondary {
  color: #757575;
}

.day-picker {
  padding: 0 1rem 0 calc(0.5rem - 2px);

  & /deep/ .mdc-list-group__subheader {
    margin-left: 0.5rem;
  }
}
</style>
