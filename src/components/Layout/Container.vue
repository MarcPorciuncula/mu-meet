<template>
  <component :is="tag" :class="classes">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    tag: VueTypes.string.def('div'),
    padding: VueTypes.oneOf(['none', 'normal', 'more', 'less', 'min']).def(
      'normal',
    ),
  },
  computed: {
    classes() {
      return ['layout-container', `layout-container--pad-${this.padding}`];
    },
  },
};
</script>

<style scoped lang="scss">
.layout-container {
  max-width: 60rem;
  width: 100%;
}

.layout-container--pad-none {
  padding: 0;
}

.layout-container--pad-min {
  padding: 0 0.5rem;
}

.layout-container--pad-less {
  padding: 0 1rem;
}

.layout-container--pad-normal {
  padding: 0 1.5rem;
}

.layout-container--pad-more {
  padding: 0 2.5rem;
}
</style>
