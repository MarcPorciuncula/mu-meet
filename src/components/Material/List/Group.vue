<template>
  <component :is="tag" class="mdc-list-group">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'MdcListGroup',
  props: {
    tag: VueTypes.string.def('div'),
  },
};
</script>
