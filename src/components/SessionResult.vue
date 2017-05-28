<template>
  <page>
    <template v-if="pending">
      <p>finding meeting times for your team...</p>
    </template>
    <template v-else>
      <p>
        your recommmended meeting time is:
      </p>
      <div class="meeting" v-html="meetings[0] ? format(meetings[0]): undefined"></div>
      <p><user-action v-on:click="showMore = true">view more meeting times</user-action></p>
      <template v-if="showMore">
        <p v-for="meeting in meetings.slice(1)" class="meeting" v-html="format(meeting)"></p>
      </template>
      <template v-if="isHost">
        <p>
          <user-action v-on:click="endSession">end session</user-action>
        </p>
        <p>
          <user-action v-on:click="startOver">start over</user-action>
        </p>
      </template>
    </template>
  </page>
</template>

<script>
import { mapState } from 'vuex';
import Page from './Page';
import UserAction from './UserAction';
import parseDate from 'date-fns/parse';
import formatDate from 'date-fns/format';
import addMinutes from 'date-fns/add_minutes';
import { PHASE_RESULT } from '@/store/modules/scheduling';
import R from 'ramda';
import store from '@/store';

export default {
  components: {
    Page,
    UserAction,
  },
  data() {
    return {
      showMore: false,
    };
  },
  async beforeRouteEnter(to, from, next) {
    const { uid } = store.state.auth;
    const { pending } = store.state.scheduling.session.result;
    const { ready } = store.state.scheduling.session.users[uid];
    if (pending && !ready) {
      await store.dispatch('fetchCalendarEvents');
      await store.dispatch('uploadEvents');
    }
    next();
  },
  computed: mapState({
    pending: state => state.scheduling.session.result.pending,
    ready: state => state.scheduling.session.users[state.auth.uid].ready,
    meetings: state =>
      R.defaultTo(
        [],
        state.scheduling.session.result.meetings,
      ).map(({ start, duration }) => ({
        start: parseDate(start),
        duration,
      })),
    isHost: state => state.scheduling.session.isHost,
    phase: state => state.scheduling.session.phase,
  }),
  watch: {
    phase(phase) {
      if (phase !== PHASE_RESULT) {
        this.$router.push({ path: '/session' });
      }
    },
  },
  methods: {
    format(meeting) {
      // FIXME deal with if the meeting starts and ends on different days
      const startDate = formatDate(meeting.start, 'ddd. DD MMMM');
      const startTime = formatDate(meeting.start, 'h:mma');
      const endTime = formatDate(
        addMinutes(meeting.start, meeting.duration),
        'h:mma',
      );
      return `${startDate}<br/>${startTime} to ${endTime}`;
    },
    startOver() {
      this.$store.dispatch('returnToLobbyPhase');
    },
    endSession() {
      this.$store.dispatch('disposeSession');
    },
  },
};
</script>
