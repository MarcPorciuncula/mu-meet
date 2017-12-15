<template>
  <div class="mw8 flex items-center justify-between ph3 pt2-ns w-100 h3">
    <component :is="linkto ? 'router-link' : 'div'" :to="linkto">
      <span
        v-if="logo"
         class="f4 bb b--gray"
       >
         MUmeet
       </span>
    </component>
    <div class="flex items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    logo: VueTypes.bool.def(true),
    linkto: {},
  },
};
</script>
