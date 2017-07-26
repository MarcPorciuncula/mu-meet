<template>
  <div>
    <transition name="drop-in">
      <router-link :to="links.signin" v-show="showHeaderGetStarted" style="display: block">
        <mdc-button raised class="get-started">
          Find a time
        </mdc-button>
      </router-link>
    </transition>
  </div>
</template>

<script>
import MdcButton from '@/components/Material/Button';
import data from './data';
import signin from '@/router/auth/signin';

export default {
  components: {
    MdcButton,
  },
  computed: {
    showHeaderGetStarted() {
      return data.showHeaderGetStarted;
    },
    links() {
      return { signin };
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.get-started {
  background-color: #2196F3;
  color: white;
}

.drop-in {
  background-color: red;

  &-enter-active, &-leave-active {
    will-change: transform, opacity;
  }

  &-enter-active {
    $duration: 400ms;
    $delay: 200ms;
    transition: mdc-animation-enter(opacity, $duration, $delay), mdc-animation-enter(transform, $duration, $delay);
  }

  &-leave-active {
    $duration: 250ms;
    transition: mdc-animation-exit-temporary(opacity, $duration), mdc-animation-exit-temporary(transform, $duration);
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
