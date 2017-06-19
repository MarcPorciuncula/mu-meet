<template>
  <component :is="tag" class="mdc-list">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    tag: VueTypes.string.def('ul'),
  },
};
</script>

<style scoped lang="scss">
@import './mdc-variables';
@import '@material/list/mdc-list';
</style>

<style scoped lang="scss">
.mdc-list {
  font-family: "Open Sans", sans-serif;
}
</style>
