import VueTypes from 'vue-types';
import './grid.scss';

const Container = {
  render(h) {
    return h(this.tag, { class: 'mdc-layout-grid' }, this.$slots.default);
  },
  props: {
    tag: VueTypes.string.def('div'),
  },
};

const Grid = {
  render(h) {
    return h('div', { class: 'mdc-layout-grid__inner' }, this.$slots.default);
  },
  props: {
    tag: VueTypes.string.def('div'),
  },
};

const Cell = {
  render(h) {
    return h(
      this.tag,
      {
        class: [
          'mdc-layout-grid__cell',
          this.span && `mdc-layout-grid__cell--span-${this.span}`,
          this.spanPhone &&
            `mdc-layout-grid__cell--span-${this.spanPhone}-phone`,
          this.spanTablet &&
            `mdc-layout-grid__cell--span-${this.spanTablet}-tablet`,
          this.spanDesktop &&
            `mdc-layout-grid__cell--span-${this.spanDesktop}-desktop`,
        ],
      },
      this.$slots.default,
    );
  },
  props: {
    tag: VueTypes.string.def('div'),
    span: VueTypes.number.def(0),
    spanPhone: VueTypes.number.def(0),
    spanTablet: VueTypes.number.def(0),
    spanDesktop: VueTypes.number.def(0),
  },
};

export { Grid, Cell, Container };
