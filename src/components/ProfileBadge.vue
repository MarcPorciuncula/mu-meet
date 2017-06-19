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
      <mdc-menu-item>
        Hi Dude
      </mdc-menu-item>
    </mdc-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import OverflowMenu from './OverflowMenu';
import MdcMenu from './Material/Menu';
import MdcMenuItem from './Material/MenuItem';

export default {
  components: {
    OverflowMenu,
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
      this.$store.dispatch('ensureUserProfile', this.$store.state.auth.uid);
    }
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
  },
  watch: {
    user(value, old) {
      if (!old && value) {
        this.greet();
      }
    },
    isSignedIn(value) {
      if (value) {
        this.$store.dispatch('ensureUserProfile', this.$store.state.auth.uid);
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
