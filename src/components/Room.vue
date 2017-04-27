<template>
  <div>

    <pick-calendars v-if="showPickCalendars"></pick-calendars>
    <lobby v-if="showLobby"></lobby>
    <output-page v-if="showResult"></output-page>
  </div>
</template>

<script>
import PickCalendars from './PickCalendars';
import FullHeader from './FullHeader';
import Lobby from './Session';
import OutputPage from './Output';

export default {
  components: {
    PickCalendars,
    FullHeader,
    Lobby,
    OutputPage,
  },
  computed: {
    isInSession() {
      return this.$store.state.session.isInSession;
    },
    isHost() {
      return this.$store.state.session.isHost;
    },
    showPickCalendars() {
      return this.$store.state.session.phase === 'SELECT_CALENDARS';
    },
    showLobby() {
      return this.$store.state.session.phase === 'WAIT' && !this.showResult;
    },
    uid() {
      return this.$store.state.auth.user.uid;
    },
    showResult() {
      return (
        !!this.$store.state.session.meetings &&
        !this.$store.state.session.computing
      );
    },
  },
  async created() {
    console.log(this.$route);
    await this.$store.dispatch('refreshSignInStatus');
    if (!this.$store.state.auth.isSignedIn) {
      if (this.$route.query.id) {
        this.$router.push(`/?id=${this.$route.query.id}`);
      } else {
        this.$router.push('/');
      }
      return;
    }
    await this.$store.dispatch('subscribeSessionStatus');
    if (!this.isInSession) {
      console.log('joining', this.$route.query.id);
      await this.$store.dispatch('joinSession', this.$route.query.id);
      await this.$store.dispatch('subscribeSessionStatus');
    }
  },
};
</script>
