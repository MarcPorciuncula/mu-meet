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
    padding: VueTypes.oneOf(['none', 'normal', 'more', 'less']).def('normal'),
  },
  computed: {
    classes() {
      return ['layout-container', `layout-container--pad-${this.padding}`];
    },
  },
};
</script>

<style lang="scss">
.layout-container--pad-none {
  padding: 0;
}

.layout-container--pad-less {
  padding: 1rem;
}

.layout-container--pad-normal {
  padding: 1.5rem;
}

.layout-container--pad-more {
  padding: 2.5rem;
}
</style>
