<template>
  <component :is="tag" :class="classes">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';
import { fromPairs } from 'ramda';

const MODIFIERS = ['dense', 'two-line', 'avatar-list', 'separated'];

const camel = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase());

export default {
  name: 'MdcList',
  props: {
    tag: VueTypes.string.def('ul'),
    ...fromPairs(
      MODIFIERS.map(modifier => [modifier, VueTypes.bool.def(false)]),
    ),
  },
  computed: {
    classes() {
      return [
        'mdc-list',
        ...MODIFIERS.filter(modifier => this[camel(modifier)]).map(
          modifier => `mdc-list--${modifier}`,
        ),
      ];
    },
  },
};
</script>

<style lang="scss">
@import '../mdc-variables';
@import '@material/list/mdc-list.scss';

.mdc-list--separated {
  padding-left: 0;
  padding-right: 0;
}

.mdc-list--separated .mdc-list-item {
  padding: 0 16px;
  border-top: 1px solid rgba(0, 0, 0, .12);
}

.mdc-list--separated .mdc-list-item:first-child {
  border-top: none;
}
</style>
