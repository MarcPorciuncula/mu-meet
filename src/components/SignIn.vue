<template>
  <div>
    <p>
      <mumeet-logo></mumeet-logo> uses your Google Calendar to check your schedule.
    </p>
    <p>
      you should pick an account which you have synced with your timetable.
    </p>
    <p>
      all set?
    </p>
    <p class="signin-button-wrapper">
      <button v-on:click="signIn()" class="md-raised">Sign in with Google</button>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MumeetLogo from './MumeetLogo';
import store from '@/store';

export default {
  components: {
    MumeetLogo,
  },
  async beforeRouteEnter(to, from, next) {
    if (store.state.auth.isSignedIn && store.getters.hasCalendarsSelected) {
      next({ path: '/session' });
    } else if (store.state.auth.isSignedIn) {
      next({ path: '/calendars', query: to.query });
    }
    next();
  },
  computed: mapState({
    isSignedIn: state => state.auth.isSignedIn,
  }),
  watch: {
    isSignedIn(value) {
      if (!value) {
        return;
      }

      let to;
      if (store.getters.hasCalendarsSelected) {
        to = this.$route.query.redirect || '/session';
      } else {
        to = {
          path: '/calendars',
          query: this.$route.query,
        };
      }

      this.$router.push(to);
    },
  },
  methods: mapActions(['signIn']),
};
</script>

<style scoped lang="scss">
.signin-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
