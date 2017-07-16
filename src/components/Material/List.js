import VueTypes from 'vue-types';
import ListItem from './ListItem';
import './list.scss';

const List = {
  render(h) {
    return h(
      this.tag,
      { class: ['mdc-list', { 'mdc-list--two-line': this.twoLine, 'mdc-list--dense': this.dense, 'mdc-list--separated': this.separated }] },
      this.$slots.default,
    );
  },
  props: {
    tag: VueTypes.string.def('ul'),
    twoLine: VueTypes.bool.def(false),
    dense: VueTypes.bool.def(false),
    separated: VueTypes.bool.def(false),
  },
};

const ListGroup = {
  render(h) {
    return h(this.tag, { class: 'mdc-list-group' }, this.$slots.default);
  },
  props: {
    tag: VueTypes.string.def('div'),
  },
};

const ListGroupHeader = {
  render(h) {
    return h(
      this.tag,
      { class: 'mdc-list-group__subheader' },
      this.$slots.default,
    );
  },
  props: {
    tag: VueTypes.string.def('span'),
  },
};

const ListGroupDivider = {
  render(h) {
    return h('hr', { class: 'mdc-list-group__divider' });
  },
};

export { List, ListItem, ListGroup, ListGroupHeader, ListGroupDivider };

export default List;
