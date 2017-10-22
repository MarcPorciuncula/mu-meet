<template>
  <div>
    <layout-section padding="less">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="title">
            Meeting Times
          </type-text>
          <type-text tag="p" type="headline" v-if="session.result.status === 'DONE'">
            You have {{ session.result.meetings.length }} possible meeting times.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-section tag="div" padding="min" v-if="events">
      <layout-container padding="less">
        <schedule-view :events="events"/>
        <type-container style="text-align: center">
          <type-text tag="p" type="body2">
            Only you can see your own calendar events.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-container v-if="!status" padding="less" style="text-align: center">
      <type-container>
        <type-text tag="p" type="headline" style="color: grey">
          No meeting times found yet.
        </type-text>
      </type-container>
    </layout-container>
    <mdc-list actionable :multiline="done && stale">
      <mdc-list-item separator />
      <mdc-list-item ripple @click="search()">
        <span slot="start-detail" class="material-icons">
          {{ stale && !status ? 'event' : 'update'}}
        </span>
        {{ stale && !status ? 'Search for' : 'Update' }} meeting times
        <span slot="secondary-text" v-if="done && stale">
          Parameters have changed since you last refreshed meeting times.
        </span>
      </mdc-list-item>
    </mdc-list>
  </div>
</template>

<script>
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import ScheduleView from '@/components/ScheduleView';
import { mapGetters } from 'vuex';
import {
  CURRENT_PLANNER_SESSION,
  CURRENT_PLANNER_EVENTS,
  CALENDARS,
} from '@/store/getters';
import {
  List as MdcList,
  ListItem as MdcListItem,
} from '@/components/Material/List';
import addSeconds from 'date-fns/add_seconds';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import { compose, map, defaultTo, path, sortBy, prop } from 'ramda';
import { REQUEST_PLANNER_RESULT } from '@/store/actions';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    ScheduleView,
    MdcList,
    MdcListItem,
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
    status() {
      return this.session.result.status;
    },
    stale() {
      return this.session.result.stale;
    },
    done() {
      return this.session.result.status === 'DONE';
    },
    meetings() {
      return compose(
        map(meeting => {
          const start = parse(meeting.start);
          const end = addSeconds(parse(meeting.end), 1);
          const duration = getDistanceInWordsStrict(end, start).replace(
            'minute',
            'min',
          );
          return {
            summary: `Meeting Slot (${duration})`,
            color: null,
            start,
            end,
          };
        }),
        defaultTo([]),
        path(['result', 'meetings']),
      )(this.session);
    },
    calendarEvents() {
      if (!this.meetings.length) {
        return [];
      }
      return compose(
        map(event => {
          const start = parse(event.start.dateTime);
          const end = parse(event.end.dateTime);
          const calendar = this.$store.getters[CALENDARS][event.calendarId];
          return {
            summary: event.summary,
            start,
            end,
            color: calendar && calendar.backgroundColor,
          };
        }),
      )(this.$store.getters[CURRENT_PLANNER_EVENTS] || []);
    },
    events() {
      if (!this.meetings.length) {
        return null;
      }
      return sortBy(prop('start'))([...this.meetings, ...this.calendarEvents]);
    },
  },
  methods: {
    search() {
      // Don't trigger a new result when one is in progress
      if (this.status && !this.done) return;

      this.$store.dispatch(REQUEST_PLANNER_RESULT);
    },
  },
};
</script>

<style scoped lang="scss">
</style>
