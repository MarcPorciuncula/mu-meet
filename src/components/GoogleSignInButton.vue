<template>
  <div :id="id" style="font-size: 1.8rem" v-on:click="$emit('click', $event)">
    <button ref="button" :class="['signin-button', { 'signin-button--hidden': hidden }]" v-on:click="signin()">Sign In With Google</button>
  </div>
</template>

<script>
import shortid from 'shortid';
import getGoogle, { SCOPE } from '@/gapi';
import PENDING_SIGN_IN from '@/store/modules/auth';

export default {
  data() {
    return {
      id: `google_signin_${shortid.generate()}`,
      hidden: true,
    };
  },
  async mounted() {
    let google;
    try {
      google = await getGoogle();
    } catch (err) {
      console.error(err);
      this.hidden = false;
      return;
    }
    if (!this.$refs.button) {
      return;
    }
    google.signin2.render(this.id, {
      scope: SCOPE,
      height: this.$refs.button.clientHeight,
      width: this.$refs.button.clientWidth,
      longtitle: true,
      onsuccess: () => {
        this.$store.dispatch('handleGoogleSignin');
      },
      // TODO handle gracefully
      onfailure: x => console.error('Failed to log in'),
    });
  },
  methods: {
    async signin() {
      const google = await getGoogle();
      this.$store.commit('updateAuthStatus', {
        pending: PENDING_SIGN_IN,
      });
      await google.auth2.getAuthInstance().signIn({
        scope: SCOPE,
      });
      await this.$store.dispatch('handleGoogleSignin');
    },
  },
};
</script>

<style scoped lang="scss">
.signin-button {
  border: none;
  outline: none;
  background-color: white;
  padding: 1.2rem 2.8rem;
  text-transform: uppercase;
  border-radius: 2px;
}

.signin-button--hidden {
  opacity: 0;
}
</style>
