<template>
  <component
    :is="tag"
    :class="['mdc-list-item', { 'mdc-list-divider': separator }]"
    :role="separator ? 'separator' : false"
  >
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    tag: VueTypes.string.def('li'),
    separator: VueTypes.bool.def(false),
  },
};
</script>

<style>
</style>
