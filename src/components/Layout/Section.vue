<template>
  <component :is="tag" :class="classes">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    tag: VueTypes.string.def('section'),
  },
  computed: {
    classes() {
      return 'layout-section';
    },
  },
};
</script>

<style scoped lang="scss">
.layout-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
