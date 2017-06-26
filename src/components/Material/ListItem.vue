<template>
  <component
    :is="tag"
    :class="['mdc-list-item', { 'mdc-list-divider': separator, 'mdc-list-item--ripple': ripple }]"
    :role="separator ? 'separator' : false"
  >
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';
import { MDCRipple } from '@material/ripple';

export default {
  props: {
    tag: VueTypes.string.def('li'),
    separator: VueTypes.bool.def(false),
    ripple: VueTypes.bool.def(false),
  },
  mounted() {
    if (this.ripple) {
      this._ripple = new MDCRipple(this.$el);
    }
  },
  beforeDestroy() {
    if (this._ripple) {
      this._ripple.destroy();
    }
  },
  watch: {
    ripple(current) {
      if (current) {
        this._ripple = new MDCRipple(this.$el);
      } else {
        this._ripple.destroy();
        this._ripple = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/ripple/mixins';

.mdc-list-item--ripple {
  @include mdc-ripple-base;
  @include mdc-ripple-bg((pseudo: '::before', base-color: black));
  @include mdc-ripple-fg((pseudo: '::after', base-color: black));

  overflow: hidden;
}
</style>
