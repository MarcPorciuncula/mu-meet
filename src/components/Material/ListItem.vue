<template>
  <component
    :is="tag"
    :class="[{ 'mdc-list-item': !separator, 'mdc-list-divider': separator, 'mdc-list-item--ripple': ripple, 'mdc-list-item--multiline': multiline }]"
    :role="separator ? 'separator' : false"
    @click="$emit('click', $event)"
  >
    <span class="mdc-list-item__start-detail" v-if="$slots['start-detail']">
      <slot name="start-detail"></slot>
    </span>
    <span class="mdc-list-item__start-detail avatar" v-if="$slots['avatar']">
      <slot name="avatar"></slot>
    </span>
    <span
      :class="['mdc-list-item__text', {
        'mdc-list-item__text--with-detail-1':
          ($slots['start-detail'] && !$slots['end-detail']) || ($slots['end-detail'] && !$slots['start-detail']),
        'mdc-list-item__text--with-detail-2':
          $slots['start-detail'] && $slots['end-detail']
      }]"
    >
      <slot>
        <span :class="['mdc-list-item__text__primary', { 'mdc-list-item__text__primary--truncate': truncate }]">{{ text }}</span>
      </slot>
      <span class="mdc-list-item__text__secondary" v-if="$slots['secondary-text']">
        <slot name="secondary-text"></slot>
      </span>
    </span>
    <span class="mdc-list-item__end-detail" v-if="$slots['end-detail']">
      <slot name="end-detail"></slot>
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
    text: VueTypes.string,
    truncate: VueTypes.bool.def(false),
    multiline: VueTypes.bool.def(false),
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

.mdc-list-item {
  color: #424242;
}

.mdc-list-item--ripple {
  // @include mdc-ripple-base;
  // @include mdc-ripple-bg((pseudo: '::before', base-color: black));
  // @include mdc-ripple-fg((pseudo: '::after', base-color: black));

  overflow: hidden;
}

.mdc-list-item__start-detail {
  margin-right: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mdc-list--dense .mdc-list-item__start-detail {
  margin-right: 1rem;
}

.mdc-list-item__start-detail.avatar {
  margin-left: -0.25rem;
  margin-right: 1.25rem;
  height: 2rem;
  width: 2rem;

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
}

.mdc-list-item__text__primary--truncate {
  width: 100%;
  text-overflow: ellipsis;
  overflow-y: hidden;
  white-space: nowrap;
}

.mdc-list-item__text--with-detail-1 {
  max-width: calc(100% - 3rem);
}

.mdc-list-item__text--with-detail-2 {
  max-width: calc(100% - 6rem);
}
</style>
