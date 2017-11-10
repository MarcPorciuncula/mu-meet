<template>
  <div class="planner-meetings">
    <layout-section padding="less">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="title">
            Meeting Times
          </type-text>
          <type-text tag="p" type="headline" v-if="status === 'DONE'">
            <span v-if="meetings.length">
              You have {{ session.result.meetings.length }} possible meeting times.
            </span>
            <span v-else>
              No meeting times found.
            </span>
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <schedule-view
      v-if="meetings.length"
      :events="events"
    />
    <layout-section tag="div" padding="none" v-if="events">
      <layout-container padding="less">
        <type-container style="text-align: center">
          <type-text tag="p" type="body2">
            Only you can see your own calendar events.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-container padding="min">
      <mdc-list actionable :multiline="done && stale">
        <template v-if="!meetings.length">
          <router-link :to="{ name: calendarsRoute.name, query: { callback: $route.path } }">
            <mdc-list-item ripple>
              <span class="material-icons" slot="start-detail">
                event_note
              </span>
              <span>
                Select your calendars
              </span>
            </mdc-list-item>
          </router-link>
          <mdc-list-item ripple @click="$emit('change-tab', 'parameters')">
            <span class="material-icons" slot="start-detail">
              tune
            </span>
            <span>
              Change parameters
            </span>
          </mdc-list-item>
        </template>
        <mdc-list-item separator />
        <mdc-list-item ripple @click="search()">
          <span slot="start-detail" class="material-icons">
            update
          </span>
          Update meeting times
          <span slot="secondary-text" v-if="done && stale">
            Parameters have changed since you last refreshed meeting times.
          </span>
        </mdc-list-item>
      </mdc-list>
    </layout-container>
    <pill-notification />
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
import MdcLinearProgress from '@/components/Material/LinearProgress';
import addSeconds from 'date-fns/add_seconds';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import { compose, map, defaultTo, path, sortBy, prop } from 'ramda';
import { REQUEST_PLANNER_RESULT } from '@/store/actions';
import calendarsRoute from '@/router/user/calendars';
import PillNotification from '@/components/PillNotification';

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
    PillNotification,
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
