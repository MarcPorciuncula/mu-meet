<template>
  <div>
    <mdc-list-group-header v-show="expanded">
      Date Range
    </mdc-list-group-header>
    <mdc-list multiline actionable>
      <mdc-list-item
        @click="!expanded && (expanded = true) || show('start')"
        :ripple="!open.start"
      >
        <span slot="start-detail" class="material-icons">
          date_range
        </span>
        <template v-if="expanded">
          <datepicker
            input-class="date-range-control_datepicker"
            calendar-class="date-range-control_datepicker_calendar"
            format="D, d MMM, yyyy"
            :value="start"
            :highlighted="highlighted"
            @selected="$emit('start-change', $event)"
            ref="start"
          />
        </template>
        <template v-else>
          Date Range
          <span slot="secondary-text">
            {{ start | format('ddd, D MMM, YYYY') }}
            to
            {{ end | format('ddd, D MMM, YYYY') }}
          </span>
        </template>
      </mdc-list-item>
      <mdc-list-item
        v-show="expanded"
        @click="show('end')"
        :ripple="!open.end"
      >
        <span slot="start-detail"></span>
        <datepicker
          input-class="date-range-control_datepicker"
          calendar-class="date-range-control_datepicker_calendar"
          format="D, d MMM, yyyy"
          :value="end"
          :highlighted="highlighted"
          :disabled="{ to: start }"
          @selected="$emit('end-change', $event)"
          ref="end"
        />
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
import Datepicker from 'vuejs-datepicker';
import format from 'date-fns/format';
import getDifferenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import addDays from 'date-fns/add_days';

// FIXME ripples are disabled after the calendar has opened to prevent
// clipping, but they are never reenabled

export default {
  props: {
    start: VueTypes.oneOfType([Date]).def(() => new Date()),
    end: VueTypes.oneOfType([Date]).def(() => new Date()),
  },
  components: {
    MdcList,
    MdcListItem,
    MdcListGroupHeader,
    Datepicker,
  },
  data() {
    return {
      expanded: false,
      open: { start: false, end: false },
    };
  },
  created() {
    // Anchor the date range to the start, shifting the end when the start is changed
    this.$on('start-change', start => {
      this.$emit(
        'end-change',
        addDays(start, getDifferenceInCalendarDays(this.end, this.start)),
      );
    });
  },
  methods: {
    show(which) {
      if (!this.$refs[which].showDayView) {
        setTimeout(() => {
          this.$refs[which].showCalendar();
        }, 10);
      }
      this.open[which] = true;
    },
  },
  computed: {
    highlighted() {
      return {
        from: this.start,
        to: this.end,
      };
    },
  },
  filters: {
    format,
  },
};
</script>

<style lang="scss">
.date-range-control_datepicker {
  background-color: inherit;
  border: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
}

.date-range-control_datepicker_calendar {

}
</style>
