<template>
  <div :class="['flipper', { 'flipper--show-secondary': this.showSecondary }]">
    <div class="flipper__inner">
      <div class="flipper-item">
        <slot name="primary" />
      </div>
      <div class="flipper-item">
        <slot name="secondary" />
      </div>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    showSecondary: VueTypes.bool.def(false),
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/variables';

.flipper {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.flipper__inner {
  height: 200%;
  position: absolute;
  will-change: transform;
  transition: transform 200ms $mdc-animation-standard-curve-timing-function;
}

.flipper-item {
  height: 50%;
}

.flipper--show-secondary .flipper__inner {
  transform: translateY(-50%);
}
</style>
