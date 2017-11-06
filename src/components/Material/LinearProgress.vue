<template>
  <div
    role="progressbar"
    :class="['mdc-linear-progress', {
      'mdc-linear-progress--indeterminate': indeterminate
    }]"
  >
    <div class="mdc-linear-progress__buffering-dots"></div>
    <div class="mdc-linear-progress__buffer"></div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
      <span class="mdc-linear-progress__bar-inner"></span>
    </div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
      <span class="mdc-linear-progress__bar-inner"></span>
    </div>
  </div>
</template>

<script>
import { MDCLinearProgress } from '@material/linear-progress';
import './linear-progress.scss';

export default {
  props: {
    indeterminate: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  mounted() {
    this.progress = MDCLinearProgress.attachTo(this.$el);
    this.progress.determinate = !this.indeterminate;
    if (this.loading) {
      this.progress.open();
    } else {
      this.progress.close();
    }
  },
  watch: {
    loading(value) {
      if (value) {
        this.progress.open();
      } else {
        this.progress.close();
      }
    },
    indeterminate(value) {
      this.determinate = !value;
    },
  },
};
</script>

<style lang="scss">
.mdc-linear-progress {
  --mdc-theme-primary: #000;
}
</style>
