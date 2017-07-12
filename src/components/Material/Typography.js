import VueTypes from 'vue-types';
import './typography.scss';

export const TypeText = {
  render(h) {
    return h(
      this.tag,
      {
        class: `type type--${this.type}`,
      },
      this.$slots.default,
    );
  },
  props: {
    tag: VueTypes.oneOfType([String, Object, Function]).isRequired,
    type: VueTypes.oneOf([
      'display4',
      'display3',
      'display2',
      'display1',
      'headline',
      'title',
      'subheading2',
      'subheading1',
      'body2',
      'body1',
      'caption',
    ]).isRequired,
  },
};

export const TypeContainer = {
  render(h) {
    return h(this.tag, { class: ['type-container', { 'type-container--trim-bottom': this.trimBottom }] }, this.$slots.default);
  },
  props: {
    tag: VueTypes.oneOfType([String, Object, Function]).def('div'),
    trimBottom: VueTypes.bool.def(false),
  },
};
