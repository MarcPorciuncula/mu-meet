<template>
  <div class="profile-badge_outer">
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
import { mapGetters } from 'vuex';
import { IS_SIGNED_IN, USER_PROFILE } from '@/store/getters';
import MdcMenu from '@/components/Material/AnchoredMenu';
import MdcMenuItem from '@/components/Material/MenuItem';
import dashboardRoute from '@/router/user/dashboard';

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
  mounted() {
    if (this.user) {
      this.greet();
    }
  },
  computed: {
    ...mapGetters({
      isSignedIn: IS_SIGNED_IN,
    }),
    user() {
      if (this.$store.getters[USER_PROFILE].name) {
        return {
          profile: this.$store.getters[USER_PROFILE],
        };
      }
      return null;
    },
    dashboardRoute: () => dashboardRoute,
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
      }, 3000);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.profile-badge,
.profile-badge_outer {
  display: flex;
  align-items: center;
}

.header_profile-picture {
  height: 1.5rem;
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
    transition: mdc-animation-exit-permanent(opacity, $duration), mdc-animation-exit-permanent(transform, $duration);
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
    transition: mdc-animation-exit-permanent(opacity, $duration);
  }

  &-enter, &-leave {
    opacity: 0;
  }
}
</style>
