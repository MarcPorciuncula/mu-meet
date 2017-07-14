<template>
  <div class="mdc-simple-menu" tabindex="-1">
    <mdc-list class="mdc-simple-menu__items" role="menu" aria-hidden="true">
      <slot></slot>
    </mdc-list>
  </div>
</template>

<script>
import { MDCSimpleMenu } from '@material/menu';
import MdcList from './List';
import './menu.scss';

export default {
  components: {
    MdcList,
  },
  mounted() {
    this.menu = new MDCSimpleMenu(this.$el);
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
