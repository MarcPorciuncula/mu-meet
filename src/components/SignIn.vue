<template>
  <layout-section class="section-signin">
    <layout-section tag="div" class="container-signin" padding="normal">
      <layout-container class="" padding="less">
        <type-container>
          <type-text tag="h3" type="headline">
            Sign in with Google to continue to MUmeet.
          </type-text>
          <type-text tag="p" type="body2">
            MUmeet uses Google Calendar to determine your schedule and find meeting times.
          </type-text>
          <type-text tag="p" type="body2">
            You may be asked to give MUmeet permission to read your calendars. We'll never show anyone your calendars without your permission.
          </type-text>
          <div class="signin-action-container">
          <google-signin-button v-on:click="signIn" :disabled="isPendingSignIn || isSignedIn" />
            <type-text tag="p" type="body2" class="help-text">
              This will pop up a new tab.
            </type-text>
          </div>
        </type-container>
      </layout-container>
    </layout-section>
  </layout-section>
</template>

<script>
import { mapState } from 'vuex';
import GoogleSigninButton from './GoogleSigninButton';
import LayoutContainer from './Layout/Container';
import LayoutSection from './Layout/Section';
import { TypeContainer, TypeText } from './Material/Typography';
import dashboard from '@/router/dashboard';
import { PENDING_SIGN_IN } from '@/store/modules/auth';

export default {
  components: {
    GoogleSigninButton,
    TypeContainer,
    TypeText,
    LayoutContainer,
    LayoutSection,
  },
  computed: mapState({
    isSignedIn: state => state.auth.isSignedIn,
    isPendingSignIn: state => state.auth.pending === PENDING_SIGN_IN,
  }),
  methods: {
    async signIn() {
      await this.$store.dispatch('signIn');
      // HACK wait for the profile to pop up in the corner, should coordinate this properly
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.$router.push(this.$route.query.callback || dashboard.path);
    },
  },
};
</script>

<style scoped lang="scss">
.section-signin {
  min-height: 72vh;
  height: 0;
  justify-content: center;
  padding: 1rem 1rem 3.475rem 1rem;
}

.help-text {
  font-size: 0.75rem;
  color: #616161;
  margin-top: 0.25rem;
}

.signin-action-container {
  text-align: center;
  margin: 3rem;
}

.container-signin {
  max-width: 30rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.2rem;
  background-color: #fff;
  // TODO utilise a callout intead of using the same style
}
</style>
