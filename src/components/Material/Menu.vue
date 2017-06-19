<template>
  <div class="mdc-menu-anchor">
    <button class="mdc-menu-button material-icons" @click="toggle">
      <slot name="icon">more_vert</slot>
    </button>
    <div class="mdc-simple-menu" tabindex="-1" ref="menu">
      <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { MDCSimpleMenu } from '@material/menu';

export default {
  mounted() {
    this.menu = new MDCSimpleMenu(this.$refs.menu);
  },
  data() {
    return {
      menu: null,
    };
  },
  methods: {
    toggle() {
      this.menu.open = !this.menu.open;
    },
  },
  beforeDestroy() {
    this.menu.destroy();
  },
};
</script>

<style lang="scss">
@import './mdc-variables';
@import '@material/menu/mdc-menu';

.mdc-menu-button {
  color: #424242;
  background: none;
  border: none;
  transform: translateY(0.1em);
  padding: 0;
}
</style>
