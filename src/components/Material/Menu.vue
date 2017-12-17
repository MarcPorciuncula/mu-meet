<template>
  <div class="mdc-simple-menu" tabindex="-1">
    <slot name="main"></slot>
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
    this.menu = MDCSimpleMenu.attachTo(this.$el);
  },
  data() {
    return {
      menu: null,
    };
  },
  methods: {
    toggle() {
      if (this.menu.open) {
        this.menu.hide();
      } else {
        this.menu.show();
      }
    },
    show() {
      this.menu.show();
    },
    hide() {
      this.menu.hide();
    },
  },
  beforeDestroy() {
    this.menu.destroy();
  },
};
</script>
