<template>
  <div class="wrapper">
    <div class="profile-badge">
      <transition name="slide-up" appear>
        <span v-show="showGreeting && user" class="header_user-name">
          Hi,&thinsp;
        </span>
      </transition>
      <transition name="slide-up" appear>
        <span v-if="user" class="header_user-name">
          {{ user.profile.given_name }}
        </span>
      </transition>
      <transition name="fade-in" appear>
        <img v-if="user" class="header_profile-picture" :src="user.profile.picture"/>
      </transition>
    </div>
    <mdc-menu>
      <router-link v-show="isSignedIn && $route.name !== dashboardRoute.name" :to="{ name: dashboardRoute.name }">
        <mdc-menu-item>
          Return to dashboard
        </mdc-menu-item>
      </router-link>
      <router-link v-show="isSignedIn" to="/signout">
        <mdc-menu-item>
          Sign out
        </mdc-menu-item>
      </router-link>
    </mdc-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { IS_SIGNED_IN, USER_UID } from '@/store/getters';
import MdcMenu from './Material/Menu';
import MdcMenuItem from './Material/MenuItem';
import dashboardRoute from '@/router/dashboard';

export default {
  components: {
    MdcMenu,
    MdcMenuItem,
  },
  data() {
    return {
      showGreeting: false,
    };
  },
  created() {
    if (this.isSignedIn) {
      this.$store.dispatch('ensureUserProfile', this.$store.getters[USER_UID]);
    }
  },
  mounted() {
    if (this.user) {
      this.greet();
    }
  },
  computed: {
    ...mapGetters({
      isSignedIn: IS_SIGNED_IN,
    }),
    ...mapState({
      user: state => state.users.users[state.auth.uid],
    }),
    dashboardRoute: () => dashboardRoute,
  },
  watch: {
    user(value, old) {
      if (!old && value) {
        this.greet();
      }
    },
    isSignedIn(value) {
      if (value) {
        this.$store.dispatch(
          'ensureUserProfile',
          this.$store.getters[USER_UID],
        );
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

.profile-badge,
.wrapper {
  display: flex;
  align-items: center;
}

.profile-badge {
  // padding: 0 0.5rem;
}

.header_profile-picture {
  height: 2rem;
  width: auto;
  border-radius: 50%;
  margin-left: 0.5rem;
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
