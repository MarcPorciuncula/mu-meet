<template>
  <div>
    <mdc-list-group-header v-show="expanded">
      Time Range
    </mdc-list-group-header>
    <mdc-list :multiline="!expanded" actionable>
      <mdc-list-item
        @click="!expanded && (expanded = true)"
      >
        <span slot="start-detail" class="material-icons">
          access_time
        </span>
        <template v-if="expanded">
          <div class="field">
            <mdc-select
              :items="hours"
              :value="_start.getHour().toString()"
              @change="change('start', 'hours', $event)"
            />
            <span>:</span>
            <mdc-select
              :items="minutes"
              disabled
              :value="_start.getMinute().toString()"
              @change="change('start', 'minutes', $event)"
            />
            <mdc-select
              :items="ampm"
              :value="_start.getHalf()"
              @change="change('start', 'ampm', $event)"
            />
          </div>
        </template>
        <template v-else>
          Time Range
          <span slot="secondary-text">
            {{ _start.getHour() }}:{{ _start.getMinute() | padStart(2, '0') }} {{ _start.getHalf() }}
            to
            {{ _end.getHour() }}:{{ _end.getMinute() | padStart(2, '0') }} {{ _end.getHalf()}}
          </span>
        </template>
      </mdc-list-item>
      <mdc-list-item
        v-show="expanded"
      >
        <span slot="start-detail"></span>
        <div class="field">
          <mdc-select
            :items="hours"
            :value="_end.getHour().toString()"
            @change="change('end', 'hours', $event)"
          />
          <span>:</span>
          <mdc-select
            :items="minutes"
            disabled
            :value="_end.getMinute().toString()"
            @change="change('end', 'minutes', $event)"
          />
          <mdc-select
            :items="ampm"
            :value="_end.getHalf()"
            @change="change('end', 'ampm', $event)"
          />
        </div>
      </mdc-list-item>
    </mdc-list>
    <type-container v-if="expanded">
      <type-text tag="p" type="body2">
        (Minute configuration is currently disabled due to a known bug.)
      </type-text>
    </type-container>
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
import MdcSelectItem from '@/components/Material/SelectItem';
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
    MdcSelectItem,
    TypeText,
    TypeContainer,
  },
  data() {
    return {
      expanded: false,
    };
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
.field {
  display: flex;
  flex-direction: row;
  align-items: flex-center;
}

.mdc-select {
  margin: 0 0.3rem;
  text-align: right;
  padding-left: 0.1rem;
  padding-right: 0.1rem;

  // disable the dropdown button
  background-image: none;
  font-size: inherit;

  &:first-child {
    margin-left: 0;
  }
}
</style>
