<template>
  <div>
    <label class="mdc-textfield" ref="textfield">
      <input :type="type" class="mdc-textfield__input" />
      <span class="mdc-textfield__label">{{ label }}</span>
    </label>
    <p v-if="$slots.helptext" class="mdc-textfield-helptext mdc-textfield-helptext--persistent">
      <slot name="helptext"></slot>
      We will <em>never</em> share your email address with third parties
    </p>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import { MDCTextfield } from '@material/textfield';

export default {
  props: {
    label: VueTypes.string.isRequired,
    type: VueTypes.string.def('text'),
  },
  mounted() {
    this.textfield = new MDCTextfield(this.$refs.textfield);
  },
  beforeDestroy() {
    this.textfield.destroy();
  },
};
</script>

<style scoped lang="scss">
@import '_mdc-variables';
@import '@material/textfield/mdc-textfield';
</style>
