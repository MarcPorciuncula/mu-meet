<template>
  <div class="mdc-select" role="listbox" tabindex="0">
    <span class="mdc-select__selected-text">
      {{ items.find(item => item.value === value).text || value }}
    </span>
    <mdc-menu class="mdc-select__menu" ref="menu">
      <mdc-menu-item
        v-if="prompt"
        role="option"
        id="prompt"
        aria-disabled="true"
      >
        {{ prompt }}
      </mdc-menu-item>
      <mdc-menu-item
        v-for="item in items"
        class="mdc-list-item"
        role="option"
        :id="item.value.toString()"
        :key="item.value"
        tabindex="0"
      >
        {{ item.text || item.value }}
      </mdc-menu-item>
    </mdc-menu>
  </div>
</template>

<script>
import { propEq } from 'ramda';
import { MDCSelect } from '@material/select';
import { MDCSimpleMenu } from '@material/menu';
import MdcMenu from './Menu';
import MdcMenuItem from './MenuItem';

export default {
  props: {
    value: {},
    prompt: {},
    items: {},
  },
  components: {
    MdcMenu,
    MdcMenuItem,
  },
  mounted() {
    // The menu must be initialized before the select
    MDCSimpleMenu.attachTo(this.$refs.menu.$el);

    this.select = MDCSelect.attachTo(this.$el);
    this.select.foundation_.resize();
    this.update();

    this.select.listen('MDCSelect:change', () => {
      this.$emit('change', this.select.value);
    });
  },
  watch: {
    value(val) {
      if (this.select.value !== val) {
        this.update();
      }
    },
  },
  methods: {
    update() {
      this.select.selectedIndex = this.items.findIndex(
        propEq('value', this.value),
      );
    },
  },
};
</script>

<style lang="scss">
@import './mdc-variables';
@import '@material/select/mdc-select';

.mdc-select {
  font-family: "Open Sans", sans-serif !important;
  box-sizing: content-box;
}
</style>
