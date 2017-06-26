<template>
  <component
    :is="tag"
    :class="[{ 'mdc-list-item': !separator, 'mdc-list-divider': separator, 'mdc-list-item--ripple': ripple }]"
    :role="separator ? 'separator' : false"
    @click="$emit('click', $event)"
  >
    <span class="mdc-list-item__start-detail" v-if="$slots['start-detail']">
      <slot name="start-detail"></slot>
    </span>
    <span class="mdc-list-item__start-detail avatar" v-if="$slots['avatar']">
      <slot name="avatar"></slot>
    </span>
    <span class="mdc-list-item__text">
      <slot></slot>
      <span class="mdc-list-item__text__secondary" v-if="$slots['secondary-text']">
        <slot name="secondary-text"></slot>
      </span>
    </span>
  </component>
</template>

<script>
import VueTypes from 'vue-types';
import { MDCRipple } from '@material/ripple';

export default {
  props: {
    tag: VueTypes.string.def('li'),
    separator: VueTypes.bool.def(false),
    ripple: VueTypes.bool.def(false),
  },
  mounted() {
    if (this.ripple) {
      this._ripple = new MDCRipple(this.$el);
    }
  },
  beforeDestroy() {
    if (this._ripple) {
      this._ripple.destroy();
    }
  },
  watch: {
    ripple(current) {
      if (current) {
        this._ripple = new MDCRipple(this.$el);
      } else {
        this._ripple.destroy();
        this._ripple = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import './mdc-variables';
@import '@material/ripple/mixins';
@import '@material/list/mdc-list'; // FIXME this means styles are included twice, once here and once in List

.mdc-list-item {
  height: auto;
  align-items: flex-start;
  color: #424242;
}

.mdc-list-item,
.mdc-list-item.mdc-ripple-upgraded {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.mdc-list-item.mdc-ripple-upgraded {
  // HACK when the list item is given a ripple, the list item is moved left and given padding, so the ripple bleeds over to the edge of the list, however it gives the list item the wrong width
  width: calc(100% + 2 * #{$mdc-list-side-padding}) !important;
}

.mdc-list-item--ripple {
  @include mdc-ripple-base;
  @include mdc-ripple-bg((pseudo: '::before', base-color: black));
  @include mdc-ripple-fg((pseudo: '::after', base-color: black));

  overflow: hidden;
}

.mdc-list-item__start-detail {
  margin-right: 1.5rem;
}

.mdc-list-item__start-detail.avatar {
  margin-top: 0.4rem;
  margin-left: -0.1rem;
  margin-right: 1.1rem;
  height: 2rem;
  width: 2rem;

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}
</style>
