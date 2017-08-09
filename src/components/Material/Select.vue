<template>
  <div class="mdc-select" role="listbox" tabindex="0">
    <span class="mdc-select__selected-text">{{ value }}</span>
    <mdc-menu class="mdc-select__menu">
      <mdc-select-item
        v-for="item in _items"
        :key="item.value"
        :id="item.value"
        :aria-selected="item.value === value"
      >
        {{ item.text }}
      </mdc-select-item>
    </mdc-menu>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import { MDCSelect } from '@material/select';
import MdcMenu from './Menu';
import MdcSelectItem from './SelectItem';
import MdcList from './List';
import './select.scss';

export default {
  components: {
    MdcMenu,
    MdcList,
    MdcSelectItem,
  },
  props: {
    items: VueTypes.arrayOf(
      VueTypes.shape({
        value: VueTypes.string.isRequired,
        text: VueTypes.string,
      }).isRequired,
    ).isRequired,
    value: {},
  },
  data() {
    return {
      last: null,
    };
  },
  mounted() {
    this.select = new MDCSelect(this.$el);

    // Set initial value
    this.update();

    this.select.listen('MDCSelect:change', this.change.bind(this));
  },
  watch: {
    value(value) {
      this.update();
    },
  },
  computed: {
    _items() {
      return this.items.map(item => ({
        text: item.text || item.value,
        value: item.value,
      }));
    },
  },
  methods: {
    change() {
      // Revert the change and emit an event so the parent can handle the value change
      const item = this._items.find(item => item.value === this.select.value);
      const value = item.value;
      this.update();
      // HACK This causes the event to be emitted again, which is why we bail when this value
      // is the same as the last
      if (value === this.value || value === this.last) {
        return;
      }
      this.$emit('change', value);
      this.last = value;
    },
    update() {
      this.select.foundation_.setSelectedIndex(
        this._items.findIndex(item => item.value === this.value),
      );
    },
  },
  beforeDestroy() {
    this.select.destroy();
  },
};
</script>

<style scoped>
.mdc-select {
  box-sizing: initial;
  font-family: inherit;
  display: inline-block;
}
</style>
