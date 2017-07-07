<template>
  <div class="mdc-form-field">
    <slot></slot>
    <label :for="id">
      {{ label }}
    </label>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    label: VueTypes.string,
    id: VueTypes.string,
  },
};
</script>

<style scoped lang="scss">
@import '_mdc-variables';
@import '@material/form-field/mdc-form-field.scss';
</style>
