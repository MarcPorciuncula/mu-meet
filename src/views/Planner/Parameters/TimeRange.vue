<template>
  <div>
    <mdc-list-group-header>
      Time Range
    </mdc-list-group-header>
    <mdc-list>
      <mdc-list-item>
        <span slot="start-detail" class="material-icons">
          access_time
        </span>
        <div class="time-range-control__field">
          <mdc-select
            :items="hours"
            :value="_start.getHour().toString()"
            @change="change('start', 'hours', $event)"
            :dropdown="false"
          />
          <span>:</span>
          <mdc-select
            :items="minutes"
            :value="_start.getMinute().toString()"
            @change="change('start', 'minutes', $event)"
            :dropdown="false"
          />
          <mdc-select
            :items="ampm"
            :value="_start.getHalf()"
            @change="change('start', 'ampm', $event)"
            :dropdown="false"
          />
        </div>
      </mdc-list-item>
      <mdc-list-item>
        <span slot="start-detail"></span>
        <div class="time-range-control__field">
          <mdc-select
            :items="hours"
            :value="_end.getHour().toString()"
            @change="change('end', 'hours', $event)"
            :dropdown="false"
          />
          <span>:</span>
          <mdc-select
            :items="minutes"
            :value="_end.getMinute().toString()"
            @change="change('end', 'minutes', $event)"
            :dropdown="false"
          />
          <mdc-select
            :items="ampm"
            :value="_end.getHalf()"
            @change="change('end', 'ampm', $event)"
            :dropdown="false"
          />
        </div>
      </mdc-list-item>
    </mdc-list>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroupHeader as MdcListGroupHeader,
} from '@/components/Material/List';
import MdcSelect from '@/components/Material/Select';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import Time from '@/util/Time';

export default {
  props: {
    start: VueTypes.integer.isRequired /* in minutes */,
    end: VueTypes.integer.isRequired /* in minutes */,
  },
  components: {
    MdcList,
    MdcListItem,
    MdcListGroupHeader,
    MdcSelect,
    TypeText,
    TypeContainer,
  },
  computed: {
    hours() {
      const result = [];
      for (let i = 1; i <= 12; i++) {
        result.push({ value: i.toString(), text: i.toString() });
      }
      return result;
    },
    minutes() {
      const result = [];
      for (let i = 0; i < 60; i += 30) {
        result.push({
          value: i.toString(),
          text: i.toString().padStart(2, '0'),
        });
      }
      return result;
    },
    ampm() {
      return [{ value: 'am' }, { value: 'pm' }];
    },
    _start() {
      return new Time(this.start);
    },
    _end() {
      return new Time(this.end);
    },
  },
  methods: {
    change(input, type, value) {
      const time = new Time(this[input]);
      if (type === 'hours') {
        time.setHour(parseInt(value));
      } else if (type === 'minutes') {
        time.setMinute(parseInt(value));
      } else {
        time.setHalf(value);
      }
      this.$emit(`${input}-change`, time.value);
    },
  },
  filters: {
    padStart(value, n, fill) {
      return value.toString().padStart(n, fill);
    },
  },
};
</script>

<style scoped lang="scss">
.time-range-control__field {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: -0.25rem;
}

.mdc-select {
  margin: 0 0.25rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  justify-content: flex-end;

  &:first-child {
    margin-left: 0;
  }
}
</style>
