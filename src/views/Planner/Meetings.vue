<template>
  <div>
    <div class="flex flex-column items-center mb4">
      <div class="mw8 w-100 pa3">
        <h3 class="f6 fw5 grey-600 lh-title">
          Meeting times
        </h3>
        <div class="bg-white br2 br--bottom elevate1 mb3 pv1">
          <schedule-view
          v-if="meetings.length"
          :events="events"
          />
        </div>
        <p class="f6 grey-700 lh-copy measure">
          Only you can see your own calendar events.
        </p>
        <div>
          <button
            class="f5 bn bg-transparent di lh-copy sans pa0 action grey-900"
            @click="search()"
          >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              update
            </span>
            <span class="bb">
              Update meeting times
            </span>
          </button>
          <p class="f6 grey-600 lh-copy measure mt" v-if="done && stale">
            Parameters have changed since you last refreshed meeting times.
          </p>
        </div>
      </div>
    </div>
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
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/List/Item';
import MdcLinearProgress from '@/components/Material/LinearProgress';
import addSeconds from 'date-fns/add_seconds';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import { compose, map, defaultTo, path, sortBy, prop } from 'ramda';
import { REQUEST_PLANNER_RESULT } from '@/store/actions';
import calendarsRoute from '@/router/user/calendars';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    ScheduleView,
    MdcList,
    MdcListItem,
    MdcLinearProgress,
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
    calendarsRoute: () => calendarsRoute,
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
.schedule-view {
  min-height: calc(100vh - (56px * 6.5));
}
</style>
