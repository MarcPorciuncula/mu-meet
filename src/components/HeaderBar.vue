<template>
  <layout-section tag="header" class="header-bar">
    <layout-container class="header-bar__inner">
      <div class="header-bar__main">
        <transition name="fade-in" mode="out-in">
          <type-text v-if="message" tag="span" type="body2" class="header-bar__title">
            {{ message }}
          </type-text>
          <flipper v-else class="title" :show-secondary="this.showTitle">
            <div class="header-bar__title" slot="primary">
              <type-text tag="h1" type="headline" key="logo">
                <mumeet-logo></mumeet-logo>
              </type-text>
            </div>
            <div class="header-bar__title" slot="secondary">
              <type-text tag="h2" type="title">
                {{ title }}
              </type-text>
            </div>
          </flipper>
        </transition>
      </div>
      <slot/>
    </layout-container>
  </layout-section>
</template>

<script>
import VueTypes from 'vue-types';
import { TypeText } from '@/components/Material/Typography';
import MumeetLogo from '@/components/MumeetLogo';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import Flipper from '@/components/Flipper.vue';

export default {
  components: {
    TypeText,
    MumeetLogo,
    LayoutSection,
    LayoutContainer,
    Flipper,
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

.header-bar {
  @include mdc-elevation(2);
  width: 100%;
  background-color: rgba(#fff, 0.95);
  height: 3.625rem;
}

.header-bar__inner {
  padding: 0 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
}

.header-bar__main {
  flex-grow: 1;
  height: 100%;
}

.header-bar__title {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-bar__title .type {
  margin: 0;
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
