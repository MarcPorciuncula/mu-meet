<template>
  <page>
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
      <google-sign-in-button></google-sign-in-button>
    </p>
  </page>
</template>

<script>
import { mapState } from 'vuex';
import Page from './Page';
import MumeetLogo from './MumeetLogo';
import GoogleSignInButton from './GoogleSignInButton';
import store from '@/store';

export default {
  components: {
    Page,
    MumeetLogo,
    GoogleSignInButton,
  },
  async beforeRouteEnter(to, from, next) {
    if (store.state.auth.isSignedIn === null) {
      await store.dispatch('refreshAuthStatus');
    }
    if (store.state.auth.isSignedIn) {
      next({ path: '/calendars', query: to.query });
    }
    next();
  },
  computed: mapState({
    isSignedIn: state => state.auth.isSignedIn,
  }),
  watch: {
    isSignedIn(isSignedIn) {
      if (isSignedIn) {
        this.$router.push({
          path: '/calendars',
          query: this.$route.query,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.signin-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
