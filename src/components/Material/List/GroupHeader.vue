<template>
  <component :is="tag" class="mdc-list-group__subheader">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'MdcListGroupHeader',
  props: {
    tag: VueTypes.string.def('span'),
  },
};
</script>
