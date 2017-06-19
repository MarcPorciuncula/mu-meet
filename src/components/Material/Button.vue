<template>
  <button
    :class="['mdc-button', {
      'mdc-button--raised': raised,
      'mdc-button--dense': dense,
      'mdc-button--compact': compact,
      'mdc-button--hero': hero,
    }]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    raised: VueTypes.bool.def(false),
    dense: VueTypes.bool.def(false),
    compact: VueTypes.bool.def(false),
    hero: VueTypes.bool.def(false),
  },
};
</script>

<style lang="scss">
@import 'mdc-variables';
@import '@material/button/mdc-button';
@import '@material/typography/mixins';

.mdc-button {
  text-transform: initial;
}

.mdc-button--hero {
  @include mdc-typography(subheading2);

  width: 100%;
  height: 3rem;
  line-height: 3rem;
}
</style>
