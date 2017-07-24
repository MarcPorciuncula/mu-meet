<template>
  <div class="mdc-menu-anchor">
    <button class="menu-anchor-button material-icons" @click="$refs.menu.toggle()">
      <slot name="icon">more_vert</slot>
    </button>
    <mdc-menu ref="menu">
      <slot></slot>
    </mdc-menu>
  </div>
</template>

<script>
import MdcMenu from './Menu';
import './menu.scss';

export default {
  components: {
    MdcMenu,
  },
};
</script>

<style lang="scss">
.menu-anchor-button {
  color: #424242;
  background: none;
  border: none;
  transform: translateY(0.1em);
  padding: 0;
}
</style>
