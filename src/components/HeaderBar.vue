<template>
  <header>
    <div style="flex-grow: 1">
      <transition name="fade-in" mode="out-in">
        <type-text v-if="message" tag="span" type="body2" key="message">
          {{ message }}
        </type-text>
        <type-text v-else tag="span" type="headline" key="logo">
          <mumeet-logo></mumeet-logo>
        </type-text>
      </transition>
    </div>
    <slot name="controls"></slot>
  </header>
</template>

<script>
import VueTypes from 'vue-types';
import { TypeText } from './Material/Typography';
import MumeetLogo from './MumeetLogo';

export default {
  components: {
    TypeText,
    MumeetLogo,
  },
  props: {
    message: VueTypes.string,
  },
};
</script>

<style scoped lang="scss">
@import '@material/elevation/mixins';
@import '@material/animation/functions';

header {
  @include mdc-elevation(2);

  height: 3.625rem;
  padding: 0 1.25rem;
  position: fixed;
  width: 100%;
  background-color: rgba(#fff, 0.95);
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 1;
}

.fade-in {
  &-enter-active {
    $duration: 300ms;
    transition: mdc-animation-enter(opacity, $duration);
  }

  &-leave-active {
    $duration: 300ms;
    transition: mdc-animation-exit(opacity, $duration);
  }

  &-enter {
    opacity: 0;
  }

  &-leave-to {
    opacity: 0;
  }
}
</style>
