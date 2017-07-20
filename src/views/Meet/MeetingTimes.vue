<template>
  <layout-section padding="normal">
    <layout-container>
      <type-container>
        <type-text tag="h3" type="subheading2">
          Meeting times
        </type-text>
      </type-container>
    </layout-container>
    <layout-container padding="min">
      <schedule-view v-if="events.length" :events="events" />
    </layout-container>
  </layout-section>
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
import addSeconds from 'date-fns/add_seconds';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import { compose, map, defaultTo, path, sortBy, prop } from 'ramda';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    ScheduleView,
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
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
      )(this.$store.getters[CURRENT_PLANNER_EVENTS]);
    },
    events() {
      return sortBy(prop('start'))([...this.meetings, ...this.calendarEvents]);
    },
  },
};
</script>

<style>

</style>
