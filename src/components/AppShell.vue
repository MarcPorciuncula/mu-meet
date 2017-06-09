<template>
  <div class="app-shell-wrapper">
    <header class="header">
      <div class="header_bar">
        <div style="flex: 1">
          <transition name="fade-in" mode="out-in">
            <span v-if="loadingMessage">{{ loadingMessage }}</span>
            <mumeet-logo v-else class="header_logo"></mumeet-logo>
          </transition>
        </div>
        <slot name="header-bar-control"></slot>
      </div>
    </header>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MumeetLogo from './MumeetLogo';

export default {
  components: {
    MumeetLogo,
  },
  computed: {
    ...mapGetters({
      loadingMessage: 'getLoadingMessage',
    }),
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';
@import '@material/elevation/mixins';

.app-shell-wrapper {
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
  @include mdc-elevation(2);

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

.content {
  position: relative;
  padding-top: 5.8rem;
  min-height: calc(100vh - 5.8rem);
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
