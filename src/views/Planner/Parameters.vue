<template>
  <div>
    <layout-section padding="less">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="title">
            Parameters
          </type-text>
          <type-text tag="p" type="headline">
            At least 30 min
            from {{ session.config.searchFromHour | formatHour }}
            to {{ session.config.searchToHour | formatHour }}
            on weekdays,
            over {{ session.config.searchFromDate | format('ddd DD MMM') }}
            to {{ session.config.searchToDate | format('ddd DD MMM') }}.
          </type-text>
        </type-container>
        <br/>
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
    <layout-section padding="normal">
      <layout-container padding="min">
        <mdc-list-group>
          <mdc-list-group-divider />
          <mdc-list>
            <mdc-list-item ripple @click="archive()">
              <span slot="start-detail" class="material-icons">
                archive
              </span>
              Archive meeting plan
            </mdc-list-item>
          </mdc-list>
        </mdc-list-group>
      </layout-container>
    </layout-section>
  </div>
</template>

<script>
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroup as MdcListGroup,
  ListGroupHeader as MdcListGroupHeader,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';
import DateRangeControl from '@/components/DateRangeControl';
import TimeRangeControl from '@/components/TimeRangeControl';
import format from 'date-fns/format';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import { SET_PLANNER_CONFIG, ARCHIVE_PLANNER_SESSION } from '@/store/actions';
import addSeconds from 'date-fns/add_seconds';
import addDays from 'date-fns/add_days';
import dashboardRoute from '@/router/user/dashboard';

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
    MdcListGroupDivider,
    DateRangeControl,
    TimeRangeControl,
  },
  props: {
    session: {},
  },
  computed: {
    config() {
      console.log(this.session.config);
      return this.session.config;
    },
  },
  filters: {
    format,
    formatHour(hours) {
      const minutes = (hours % 1) * 60;
      let date = new Date();
      date = setMinutes(date, minutes);
      date = setHours(date, hours);
      return format(date, 'h:mma');
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
    archive() {
      this.$store.dispatch(ARCHIVE_PLANNER_SESSION);
      this.$router.push({ name: dashboardRoute.name });
    },
  },
};
</script>

<style scoped lang="scss">

</style>
