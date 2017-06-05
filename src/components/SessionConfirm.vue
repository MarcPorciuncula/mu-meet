<template>
  <div>
    <p>we're almost there</p>
    <p>we'll search for meeting times of at least {{ hours }} {{ range }} on {{ days }} from {{ from }} to {{ to }}, but not on university holidays.
    </p>
    <p>
      want to change these options?<br/>
      <user-action>customize constraints</user-action>
    </p>
    <p>
      we'll be using the following calendars from your account:<br/>
      <template v-for="calendar in calendars">
        <span v-for="calendar in calendars" class="calendar-list_item" key="calendar.id">
          - {{ calendar.summary }}
        </span><br/>
      </template>
      <user-action>
        change calendars
      </user-action>
    </p>
    <p v-if="isHost">
      good to go?<br/>
      <user-action v-on:click="advance()">
        find meeting times
      </user-action>
    </p>
    <p v-else>
      sit tight, your host will advance when ready
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import UserAction from './UserAction';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import addHours from 'date-fns/add_hours';
import R from 'ramda';
import { PHASE_CONFIGURE } from '@/store/modules/scheduling';
import store from '@/store';

export default {
  components: {
    UserAction,
  },
  async beforeRouteEnter(to, from, next) {
    if (!Object.keys(store.state.calendars).length) {
      await store.dispatch('fetchCalendars');
    }
    next();
  },
  computed: mapState({
    isHost: state => state.scheduling.session.isHost,
    calendars: state =>
      Object.values(state.calendars).filter(R.prop('selected')),
    config: state => state.scheduling.session.config,
    phase: state => state.scheduling.session.phase,
    sessionId: state => state.scheduling.session.id,
    hours() {
      const hours = this.config.minDuration;
      const now = new Date();
      return getDistanceInWordsStrict(now, addHours(now, hours));
    },
    range() {
      // TODO actually get the range
      return 'this week';
    },
    days() {
      return getDaysOfWeekInWords(this.config.days);
    },
    from() {
      const { searchFromHour } = this.config;
      const suffix = searchFromHour < 12 ? 'am' : 'pm';
      const hour = searchFromHour % 12;
      return hour.toString() + suffix;
    },
    to() {
      const { searchToHour } = this.config;
      const suffix = searchToHour < 12 ? 'am' : 'pm';
      const hour = searchToHour % 12;
      return hour.toString() + suffix;
    },
  }),
  methods: {
    advance() {
      this.$store.dispatch('advanceToResultPhase');
    },
  },
  watch: {
    phase(phase) {
      if (phase !== PHASE_CONFIGURE) {
        this.$router.push({ path: '/session' });
      }
    },
  },
};

function list(items, and = 'and') {
  switch (items.length) {
    case 0:
      return '';
    case 1:
      return items[0];
    case 2:
      return items.join(` ${and} `);
    default:
      return [
        ...items.slice(0, items.length - 1),
        `${and} ` + items[items.length - 1],
      ].join(', ');
  }
}

const ALL_DAYS = {
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
};

const WEEKDAYS = {
  sunday: false,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
};

function getDaysOfWeekInWords(days) {
  if (R.equals(days, ALL_DAYS)) {
    return 'any day';
  }
  if (Object.keys(R.pickBy(R.identity, days)).length === 6) {
    const excludedDay = Object.keys(R.pickBy(R.complement, days))[0];
    return `any day except ${excludedDay}`;
  }
  if (R.equals(days, WEEKDAYS)) {
    return 'weekdays';
  }
  return list(
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ].filter(day => days[day]),
    'or',
  );
}
</script>

<style>
.calendar-list_item {
  color: black;
  font-size: 2rem;
  margin: 1rem 0.5rem;
}
</style>
