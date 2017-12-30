<template>
  <mdc-list
    v-if="events.length"
    two-line
    separated
    dense
  >
    <mdc-list-item
      v-for="event in events"
      :key="event.id || event.start.toString() + event.end.toString()"
    >
      <calendar-dot slot="graphic" :color="event.color"/>
      {{ event.summary }}
      <span slot="secondary">
        {{ event.start.getHour() }}:{{ event.start.getMinute() | padStart(2, '0') }}{{ event.start.getHalf() }}
        {{' - '}}
        {{ event.end.getHour() }}:{{ event.end.getMinute() | padStart(2, '0') }}{{ event.end.getHalf() }}
      </span>
    </mdc-list-item>
  </mdc-list>
</template>

<script>
import VueTypes from 'vue-types';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/List/Item';
import CalendarDot from '@/components/CalendarDot';
import Time from '@/util/Time';

export default {
  props: {
    events: VueTypes.arrayOf(
      VueTypes.shape({
        start: VueTypes.instanceOf(Time).isRequired,
        end: VueTypes.instanceOf(Time).isRequired,
        summary: VueTypes.string.isRequired,
        color: {} /* nullable string */,
      }).isRequired,
    ).isRequired,
  },
  components: {
    TypeText,
    TypeContainer,
    MdcList,
    MdcListItem,
    CalendarDot,
  },
  filters: {
    padStart(value, n, fill) {
      return value.toString().padStart(n, fill);
    },
  },
};
</script>

<style scoped lang="scss">
.mdc-list-item {
  border-left: solid 1px rgba(0, 0, 0, 0.12);
  border-right: solid 1px rgba(0, 0, 0, 0.12);
}
</style>
