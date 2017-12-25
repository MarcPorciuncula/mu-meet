<template>
  <div :class="['outer', { open }]">
    <div class="inner">
      <div
        v-if="open"
        class="show-expanded"
      >
        <slot></slot>
      </div>
      <div
        v-else
        class="show-compact"
      >
        <Toolbar @open="$emit('open')" @change-tab="$emit('change-tab', $event)"/>
      </div>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import Toolbar from './Toolbar';

export default {
  name: 'PlannerSlideOut',
  props: {
    open: VueTypes.bool.def(false),
  },
  components: {
    Toolbar,
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.outer {
  position: absolute;
  left: 0;
  top: 64px;
  height: calc(100vh - 64px);
  width: 100%;
  overflow: hidden;
  pointer-events: none;
}

.outer.open {
  pointer-events: auto;
}

.outer.open .inner {
  transform: none;
  transition: mdc-animation-exit-temporary(transform, 350ms);
}

.inner {
  width: 100%;
  height: 100%;
  transform: translateY(calc(-100% + 52px));
  transition: mdc-animation-enter(transform, 350ms);
  background-color: rgba(darken(#263238, 10%), 0.95);
  color: white;
  pointer-events: initial;
  overflow-y: scroll;
  overscroll-behavior: contain;
  padding-bottom: 64px;
}

.show-compact {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
