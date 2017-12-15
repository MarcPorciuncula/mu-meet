<template>
  <div class="flex flex-column" style="flex-grow: 1">
    <HeaderBar :linkto="{ name: 'landing-page' }"/>
    <div class="flex flex-column items-center justify-center-ns pv1" style="flex-grow: 1">
      <div class="bg-grey-50 mw6 mh3 mt4-ns ph3 ph4-ns pv2 ba br2 b--gray">
        <h3 class="f3 fw3 lh-title">
          Sign in with Google to continue to MUmeet.
        </h3>
        <div class="mv4 mv5-ns tc">
          <GoogleSigninButton :disabled="isSigningIn" @click="signIn"/>
          <p
            v-if="!isSigningIn"
            class="f7 lh-copy grey-600 ma2"
          >
            This will pop up a new tab.
          </p>
          <p
            v-else
            class="f6 lh-copy grey-600 ma1"
          >
            Signing in...
          </p>
        </div>
      </div>
      <div class="mw6 pa3 mb4-ns">
        <p class="f6 lh-copy grey-800">
          MUmeet uses Google Calendar to determine your schedule and find meeting times.
        </p>
        <p class="f6 lh-copy grey-800">
          You may be asked to give MUmeet permission to read your calendars. We'll never show anyone your calendars without your permission.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/views/HeaderBar';
import { mapGetters } from 'vuex';
import GoogleSigninButton from '@/components/GoogleSigninButton';
import dashboard from '@/router/user/dashboard';
import { IS_SIGNED_IN, SIGN_IN_PENDING } from '@/store/getters';
import { SIGN_IN } from '@/store/actions';

export default {
  components: {
    GoogleSigninButton,
    HeaderBar,
  },
  computed: mapGetters({
    isSignedIn: IS_SIGNED_IN,
    isSigningIn: SIGN_IN_PENDING,
  }),
  methods: {
    async signIn() {
      await this.$store.dispatch(SIGN_IN);
      this.$router.push(this.$route.query.callback || { name: dashboard.name });
    },
  },
};
</script>
