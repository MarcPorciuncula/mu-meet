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
    padding: VueTypes.oneOf(['none', 'normal', 'more', 'less', 'min']).def(
      'none',
    ),
  },
  computed: {
    classes() {
      return ['layout-section', `layout-section--pad-${this.padding}`];
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

.layout-section--pad-none {}

.layout-section--pad-min {
  padding: 0.5rem 0;
}

.layout-section--pad-less {
  padding: 1rem 0;
}

.layout-section--pad-normal {
  padding: 1.5rem 0;
}

.layout-section--pad-more {
  padding: 2.5rem 0;
}
</style>
