<template>
  <div class="wrapper">
    <div class="background-gradient"></div>
    <div class="background-image"></div>
    <div class="header-bar">
      <router-link to="/">
        <mumeet-logo></mumeet-logo>
      </router-link>
      <template v-if="isSignedIn">
        <div class="header-bar_profile">
          <span class="username">Hi, {{ user.profile.given_name }}</span>
          <img class="header-bar_picture" :src="user.profile.picture"/>
        </div>
      </template>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MumeetLogo from './MumeetLogo';

export default {
  components: {
    MumeetLogo,
  },
  computed: mapState({
    isSignedIn: state => state.auth.isSignedIn,
    user: state => state.users.users[state.auth.uid],
  }),
};
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 100vh;
  position: relative;
}

.background-image,
.background-gradient {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.background-image {
  background: url("../assets/clock-splash.jpg"), #E3E9E4;
  background-size: auto 140vmax;
  background-position: 0 100%;
  z-index: -2;
}

.background-gradient {
  background: linear-gradient(#F9FAFC, rgba(#F9FAFC, 0.9) 30%, rgba(#F9FAFC, 0) 80%, transparent), rgba(#F9FAFC, 0.1);
  z-index: -1;
}

.header-bar,
.content {
  padding: 2rem;
  color: var(--type-color);
  max-width: 800px;
  margin: 0 auto;
}

.header-bar {
  font-size: 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  font-size: 2.4rem;
}

.username {
  font-size: 1.6rem;
}

.header-bar_picture {
  height: 3rem;
  width: auto;
  border-radius: 50%;
  margin-left: 1rem;
}

.header-bar_profile {
  display: flex;
  align-items: center;
}
</style>
