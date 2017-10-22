<template>
  <div class="mdc-checkbox" ref="root">
    <input
      type="checkbox"
      class="mdc-checkbox__native-control"
      @change="$emit('change', getInnerValue());"
    />
    <div class="mdc-checkbox__background">
      <svg
        class="mdc-checkbox__checkmark"
        viewBox="0 0 24 24"
      >
        <path
          class="mdc-checkbox__checkmark__path"
          fill="none"
          stroke="white"
          d="M1.73,12.91 8.1,19.28 22.79,4.59"
        />
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
  </div>
</template>

<script>
import { MDCCheckbox } from '@material/checkbox';

export default {
  props: {
    value: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.checkbox = new MDCCheckbox(this.$refs.root);
    this.checkbox.checked = this.value;
    this.checkbox.disabled = this.disabled;
  },
  watch: {
    disabled(value) {
      this.checkbox.disabled = value;
    },
    value(checked) {
      this.checkbox.checked = checked;
    },
  },
  methods: {
    getInnerValue() {
      return this.checkbox.checked;
    },
  },
  beforeDestroy() {
    this.checkbox.destroy();
  },
};
</script>

<style lang="scss">
@import '@material/checkbox/mdc-checkbox';

.mdc-checkbox__background {
  --mdc-theme-secondary: black;
}
</style>
