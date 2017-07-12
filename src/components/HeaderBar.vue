<template>
  <layout-section tag="header" class="header">
    <layout-container class="header_inner">
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

export default {
  components: {
    TypeText,
    MumeetLogo,
    LayoutSection,
    LayoutContainer,
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

.header {
  @include mdc-elevation(2);
  width: 100%;
  background-color: rgba(#fff, 0.95);
}

.header_inner {
  padding: 0 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
}

.header,
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
