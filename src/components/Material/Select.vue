<template>
  <div
    class="mdc-select"
    role="listbox"
    tabindex="0"
  >
    <div class="mdc-select__surface">
      <div
        :class="['mdc-select__label', {
          'mdc-select__label--float-above': selectedIndex > -1
        }]"
      >
        {{ label }}
      </div>
      <div class="mdc-select__selected-text"></div>
      <div class="mdc-select__bottom-line"></div>
    </div>
    <MdcMenu class="mdc-select__menu" ref="menu">
      <MdcMenuItem
        v-for="item in items"
        class="mdc-list-item"
        role="option"
        :id="item.value.toString()"
        :key="item.value"
        tabindex="0"
        :aria-disabled="item.disabled"
      >
        {{ item.text || item.value }}
      </MdcMenuItem>
    </MdcMenu>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import { propEq } from 'ramda';
import { MDCSelect } from '@material/select';
import MdcMenu from '@/components/Material/Menu';
import MdcMenuItem from '@/components/Material/Menu/Item';

export default {
  props: {
    value: VueTypes.any,
    label: VueTypes.string.isRequired,
    items: VueTypes.arrayOf(
      VueTypes.shape({
        value: VueTypes.string,
        text: VueTypes.string,
      }),
    ),
    dropdown: { default: true },
  },
  components: {
    MdcMenu,
    MdcMenuItem,
  },
  mounted() {
    this.select = new MDCSelect(this.$el);
    this.select.selectedIndex = this.items.findIndex(
      propEq('value', this.value),
    );

    this.select.listen('MDCSelect:change', () => {
      this.$emit('change', this.select.value);
    });
  },
  computed: {
    selectedIndex() {
      return this.items.findIndex(propEq('value', this.value));
    },
  },
  watch: {
    selectedIndex(index) {
      this.select.selectedIndex = index;
    },
  },
};
</script>

<style lang="scss">
@import './mdc-variables';
@import '@material/select/mdc-select';

.mdc-select {
  font-family: "Open Sans", sans-serif !important;
}

.mdc-select--no-dropdown {
  background-image: none;
}
</style>
