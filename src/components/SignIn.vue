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
import Page from './Page';
import MumeetLogo from './MumeetLogo';
import GoogleSignInButton from './GoogleSignInButton';

export default {
  components: {
    Page,
    MumeetLogo,
    GoogleSignInButton,
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
