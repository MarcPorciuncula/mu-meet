<template>
  <span class="clipboard-target">
    {{ value }}
    <transition name="fade-in" mode="out-in">
      <span v-if="!copied" class="material-icons inline-icon" key="copy">content_copy</span>
      <span v-else key="copied">
        <span class="material-icons inline-icon">done</span>
        Copied to clipboard!
      </span>
    </transition>
  </span>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    value: VueTypes.string.isRequired,
  },
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    copy() {
      const selection = window.getSelection();
      selection.empty();
      const range = document.createRange();
      range.setStart(this.$el, 0);
      range.setEnd(this.$el, 1);
      selection.addRange(range);
      document.execCommand('copy');
      this.copied = true;
    },
  },
  watch: {
    copied(value) {
      if (value) {
        setTimeout(() => (this.copied = false), 3000);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.inline-icon {
  font-size: 120%;
  transform: translateY(20%);
}

.fade-in {
  &-enter-active {
    $duration: 100ms;
    transition: mdc-animation-enter(opacity, $duration);
  }

  &-leave-active {
    $duration: 100ms;
    transition: mdc-animation-exit-temporary(opacity, $duration);
  }

  &-enter {
    opacity: 0;
  }

  &-leave-to {
    opacity: 0;
  }
}
</style>
