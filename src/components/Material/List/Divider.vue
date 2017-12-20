<template>
  <component :is="tag" role="separator" :class="classes"></component>
</template>

<script>
import VueTypes from 'vue-types';
import { fromPairs } from 'ramda';

const MODIFIERS = ['inset', 'padded'];

export default {
  name: 'MdcListDivider',
  props: {
    tag: VueTypes.string.def('li'),
    ...fromPairs(
      MODIFIERS.map(modifier => [modifier, VueTypes.bool.def(false)]),
    ),
  },
  computed: {
    classes() {
      return [
        'mdc-list-divider',
        ...MODIFIERS.filter(modifier => this[modifier]).map(
          modifier => `mdc-list-divider--${modifier}`,
        ),
      ];
    },
  },
};
</script>
