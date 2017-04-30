<template>
  <div class="splash">
    <div class="splash_image"></div>
    <div class="splash_gradient"></div>
    <div class="splash_content">
      <div class="header">
        <h1 class="title">
          <mumeet-logo></mumeet-logo>
        </h1>
        <h2 class="subtitle">
          Spend time collaborating, <br/>not scheduling
        </h2>
      </div>
      <div class="splash_main">
        <div class="splash_main_inner">
          <p>
            Find meeting times that<br/>
            suit you and your team's<br/>
            calendars with <mumeet-logo></mumeet-logo>
          </p>
          <p>
            <router-link to="/login"><user-action>Get Started</user-action></router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MumeetLogo from './MumeetLogo';
import UserAction from './UserAction';

export default {
  components: {
    MumeetLogo,
    UserAction,
  },
  methods: {
    goToSignIn() {
      this.$router.push({ name: 'SignIn' });
    },
  },
};
</script>

<style scoped lang="scss">
.splash {
  min-height: 100vh;
  position: relative;
}

.splash_gradient,
.splash_image,
.splash_content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.splash_image {
  background: url("../assets/clock-splash.jpg"), #E3E9E4;
  background-size: auto 140vmax;
  background-position: 45% 100%;
  z-index: 1;
}

.splash_gradient {
  background: linear-gradient(#F9FAFC, rgba(#F9FAFC, 0.9) 30%, rgba(#F9FAFC, 0) 80%, transparent), rgba(#F9FAFC, 0.1);
  z-index: 2
}

.splash_content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  z-index: 4;
}

.title {
  font-weight: normal;
  font-size: 3.6rem;
  margin: 0;
}

.subtitle {
  font-size: 2.4rem;
  font-weight: normal;
  text-transform: lowercase;
  margin: 0;
}

.splash_main {
  font-size: 1.8rem;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.splash_main_inner {
  padding-bottom: 8rem;
}

</style>
