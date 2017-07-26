<template>
  <layout-section padding="min">
    <layout-container>
      <type-container>
        <type-text tag="h3" type="subheading2">
          Parameters
        </type-text>
      </type-container>
    </layout-container>
    <layout-container padding="min">
      <mdc-list-group>
        <date-range-control
          :start="session.config.searchFromDate"
          :end="session.config.searchToDate"
          @start-change="change('searchFromDate', $event)"
          @end-change="change('searchToDate', $event)"
        />
        <time-range-control
          :start="config.searchFromHour * 60"
          :end="config.searchToHour * 60"
          @start-change="change('searchFromHour', $event)"
          @end-change="change('searchToHour', $event)"
        />
        <mdc-list-group-header>
          Active Days (not working)
        </mdc-list-group-header>
        <mdc-list multiline>
          <mdc-list-item>
            <span slot="start-detail" class="material-icons">
              view_week
            </span>
            Weekdays
            <span slot="secondary-text">
              Mon., Tue., Wed., Thu., Fri.
            </span>
          </mdc-list-item>
        </mdc-list>
        <mdc-list-group-header>
          Minimum Duration (not working)
        </mdc-list-group-header>
        <mdc-list>
          <mdc-list-item>
            <span slot="start-detail" class="material-icons">
              timelapse
            </span>
            30 Minutes
          </mdc-list-item>
        </mdc-list>
      </mdc-list-group>
    </layout-container>
  </layout-section>
</template>

<script>
import { mapGetters } from 'vuex';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroup as MdcListGroup,
  ListGroupHeader as MdcListGroupHeader,
} from '@/components/Material/List';
import DateRangeControl from '@/components/DateRangeControl';
import TimeRangeControl from '@/components/TimeRangeControl';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { SET_PLANNER_CONFIG } from '@/store/actions';
import addSeconds from 'date-fns/add_seconds';
import addDays from 'date-fns/add_days';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeText,
    TypeContainer,
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupHeader,
    DateRangeControl,
    TimeRangeControl,
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
    config() {
      return this.session.config;
    },
  },
  methods: {
    change(prop, value) {
      // The date picker gives dates on 00:00:00, but we want the end date to be 23:59:59
      if (prop === 'searchToDate') {
        value = addSeconds(addDays(value, 1), -1);
      }
      if (prop === 'searchFromHour' || prop === 'searchToHour') {
        value = value / 60;
      }
      this.$store.dispatch(SET_PLANNER_CONFIG, {
        [prop]: value,
      });
    },
  },
};
</script>
