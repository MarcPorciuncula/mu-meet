<template>
  <div :id="id" style="font-size: 1.8rem">
    <button ref="button" :class="['signin-button', { 'signin-button--hidden': hidden }]" v-on:click="signin()">Sign In With Google</button>
  </div>
</template>

<script>
import shortid from 'shortid';
import getGoogle from '@/gapi';

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
    // TODO connect
    console.log(this.$refs.button, this.$refs.button.clientHeight);
    google.signin2.render(this.id, {
      scope: '',
      height: this.$refs.button.clientHeight,
      width: this.$refs.button.clientWidth,
      longtitle: true,
      onsuccess: x => x,
      onfailure: x => x,
    });
  },
  methods: {
    async signin() {
      const google = await getGoogle();
      // TODO connect
      if (google) {
      }
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
