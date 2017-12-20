<template>
  <div class="mdc-simple-menu" tabindex="-1">
    <slot name="main"></slot>
    <MdcList class="mdc-simple-menu__items" role="menu" aria-hidden="true">
      <slot></slot>
    </MdcList>
  </div>
</template>

<script>
import { MDCSimpleMenu } from '@material/menu';
import MdcList from '@/components/Material/List';

export default {
  name: 'MdcMenu',
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

<style lang="scss">
@import '../mdc-variables';
@import '@material/menu/mdc-menu';
</style>
