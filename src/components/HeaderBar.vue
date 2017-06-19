<template>
  <header>
    <div style="flex-grow: 1">
      <transition name="fade-in" mode="out-in">
        <type-text v-if="message" tag="span" type="body2" key="message">
          {{ message }}
        </type-text>
        <div v-else :class="['title', { 'title--show-subtitle': showTitle }]">
          <div class="title_inner">
            <div class="title_item">
              <type-text tag="h1" type="headline" key="logo">
                <mumeet-logo></mumeet-logo>
              </type-text>
            </div>
            <div class="title_item">
              <type-text tag="h2" type="title">
                {{ title }}
              </type-text>
            </div>
          </div>
        </div>
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
    title: VueTypes.string,
    showTitle: VueTypes.bool.def(false),
  },
};
</script>

<style scoped lang="scss">
@import '@material/elevation/mixins';
@import '@material/animation/functions';

header {
  @include mdc-elevation(2);

  padding: 0 1.25rem;
  position: fixed;
  width: 100%;
  background-color: rgba(#fff, 0.95);
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 1;
}

header,
.title,
.title_item {
  height: 3.625rem;
}

.title {
  position: relative;
  overflow: hidden;
}

.title_item {
  display: flex;
  align-items: center;
}

.title_item .type {
  margin: 0;
}

.title_inner {
  height: 200%;
  position: absolute;
}

.title_inner {
  will-change: transform;
  transition: transform 200ms $mdc-animation-fast-out-slow-in-timing-function;
}

.title--show-subtitle .title_inner {
  transform: translateY(-50%);
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
