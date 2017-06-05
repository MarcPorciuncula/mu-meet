<template>
  <div class="wrapper">
    <header class="header">
      <div class="header_bar">
        <div style="flex: 1">
          <transition name="slide-up" mode="out-in">
            <span v-if="loadingMessage">{{ loadingMessage }}</span>
            <mumeet-logo v-else class="header_logo"></mumeet-logo>
          </transition>
        </div>
        <transition name="slide-up" appear>
          <span v-show="showGreeting && user" class="header_user-name">
            Hi,&thinsp;
          </span>
        </transition>
        <transition name="slide-up" appear>
          <span class="header_user-name">
            {{ user && user.profile.given_name }}
          </span>
        </transition>
        <transition name="fade-in" appear>
          <img class="header_profile-picture" :src=" user && user.profile.picture" @click="showMenu = !showMenu" />
        </transition>
      </div>
      <div class="header_menu" v-show="showMenu">
        <div class="menu_arrow"></div>
        <div class="menu_inner">
          <ul class="menu-list">
            <li class="menu-item">Leave session</li>
            <li class="menu-separator"></li>
            <li class="menu-item">Profile</li>
            <li class="menu-item">Settings</li>
            <li class="menu-item">Help</li>
            <li class="menu-item">Sign out</li>
            <li class="menu-separator"></li>
            <li class="menu-item">Report a bug</li>
          </ul>
        </div>
      </div>
    </header>
    <div :class="['content', { 'content--hidden': showMenu }]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MumeetLogo from './MumeetLogo';

export default {
  components: {
    MumeetLogo,
  },
  data() {
    return {
      showMenu: false,
      showGreeting: false,
    };
  },
  mounted() {
    if (this.user) {
      this.greet();
    }
  },
  computed: {
    ...mapState({
      isSignedIn: state => state.auth.isSignedIn,
      user: state => state.users.users[state.auth.uid],
    }),
    ...mapGetters({
      loadingMessage: 'getLoadingMessage',
    }),
  },
  watch: {
    user(value, old) {
      if (!old && value) {
        this.greet();
      }
    },
  },
  methods: {
    greet() {
      this.showGreeting = true;
      setTimeout(() => {
        this.showGreeting = false;
      }, 2000);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.wrapper {
  min-height: 100vh;
  position: relative;
}

.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header_bar {
  height: 5.8rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  background-color: rgba(#fff, 0.95);
  width: 100%;
}

.header_logo {
  font-size: 2.4rem;
}

.header_menu {
  width: 100%;
  flex-grow: 1;
  border-top: 2px solid rgba(#000, 0.1);
  border-bottom: 2px solid rgba(#000, 0.1);
  position: relative;
  background-color: white;
}

.menu_inner {
  position: relative;
}

.menu_arrow {
  position: absolute;
  top: -7px;
  right: 3rem;
  width: 12px;

  &::before {
    content: " ";
    background-color: white;
    width: 14px;
    height: 14px;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border: 2px solid rgba(#000, 0.1);
    transform: rotate(45deg);
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 7px;
    left: -5px;
    width: 24px;
    height: 10px;
    background-color: white;
  }
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.4rem;
}

.menu-item {
  margin: 0;
  padding: 1.2rem 2.5rem;
}

.menu-separator {
  height: 0;
  margin: 0.5rem 0;
  border-top: 2px solid rgba(#000, 0.03);
}

.content {
  position: relative;
  font-size: 2.4rem;
  padding-top: 5.8rem;
}

.content--hidden::after {
  position: absolute;
  display: block;
  content: " ";
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}

.header_profile-picture {
  height: 3rem;
  width: auto;
  border-radius: 50%;
  margin-left: 1rem;
}

.slide-up {
  &-enter-active {
    $duration: 600ms;
    $delay: 300ms;
    transition: mdc-animation-enter(opacity, $duration, $delay), mdc-animation-enter(transform, $duration, $delay);
  }

  &-leave-active {
    $duration: 300ms;
    transition: mdc-animation-exit(opacity, $duration), mdc-animation-exit(transform, $duration);
  }

  &-enter {
    opacity: 0;
    transform: translateY(50%);
  }

  &-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }
}

.fade-in {
  &-enter-active {
    $duration: 1000ms;
    $delay: 300ms;
    transition: mdc-animation-enter(opacity, $duration, $delay);
  }

  &-leave-active {
    $duration: 200ms;
    transition: mdc-animation-exit(opacity, $duration);
  }

  &-enter, &-leave {
    opacity: 0;
  }
}
</style>
