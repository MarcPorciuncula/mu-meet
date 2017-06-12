<template>
  <button
    :class="['mdc-button', {
      'mdc-button--raised': raised,
      'mdc-button--dense': dense,
      'mdc-button--compact': compact,
    }]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    raised: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
@import 'mdc-variables';
@import '@material/button/mdc-button';

.mdc-button {
  text-transform: initial;
}
</style>
