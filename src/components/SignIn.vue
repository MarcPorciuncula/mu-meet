<template>
  <section>
    <h2 class="section_headline">
      Sign in
    </h2>
    <div class="section_center-body">
      <div class="signin-form">
        <h3 class="signin-form_headline">Sign in with Google to continue to MUmeet</h3>
        <p>MUmeet uses Google Calendar to determine your schedule and find meeting times.</p>
        <google-signin-button v-on:click="signIn()" :disabled="isPendingSignIn || isSignedIn"/>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import GoogleSigninButton from './GoogleSigninButton';
import dashboard from '@/router/dashboard';

export default {
  components: {
    GoogleSigninButton,
  },
  computed: mapState({
    isSignedIn: state => state.auth.isSignedIn,
    isPendingSignIn: state => state.auth.pending === 'PENDING_SIGN_IN',
  }),
  methods: {
    async signIn() {
      await this.$store.dispatch('signIn');
      // HACK wait for the profile to pop up in the corner, should coordinate this properly
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.$router.push(this.$route.query.callback || dashboard.path);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/elevation/mixins';

section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 5.8rem);
  background-color: #FAFAFA;
}

.section_headline {
  margin-top: 0;
  font-size: 3.6rem;
}

.section_center-body {
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: -5.8rem;
}


.signin-form {
  text-align: center;
}

.signin-form_headline {
  font-size: 2.8rem;
  margin-top: 0;
  margin-bottom: 1em;
  font-weight: 400;
}

.google-signin-button {
  margin-top: 3rem;
}
</style>
