<template>
  <div class="nprogress-wrapper">
    <slot message="message"></slot>
  </div>
</template>

<script>
import nprogress from 'nprogress';
import { mapGetters } from 'vuex';
import {
  SHOW_PROGRESS_BAR_AT,
  WATCH_PROGRESS_INCREMENT,
} from '@/store/getters';

const UPDATE_FREQUENCY = 150;

export default {
  data() {
    return {
      now: performance.now(),
      inProgress: false,
    };
  },
  computed: mapGetters({
    showProgressBarAt: SHOW_PROGRESS_BAR_AT,
    increment: WATCH_PROGRESS_INCREMENT,
  }),
  mounted() {
    nprogress.configure({ parent: '.nprogress-wrapper', showSpinner: false });
    this.update();
  },
  watch: {
    showProgressBarAt(value) {
      if (!value && this.inProgress) {
        nprogress.done();
        this.inProgress = false;
        clearTimeout(this.timeout);
      } else if (value) {
        this.update();
      }
    },
    increment() {
      nprogress.inc();
    },
  },
  methods: {
    update() {
      this.now = performance.now();
      if (
        this.showProgressBarAt &&
        this.showProgressBarAt < this.now &&
        !this.inProgress
      ) {
        nprogress.start();
        this.inProgress = true;
      }
      this.timeout = setTimeout(this.update, UPDATE_FREQUENCY);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss">
@import '~nprogress/nprogress.css';

.nprogress-custom-parent {
  overflow: initial;
}
</style>
