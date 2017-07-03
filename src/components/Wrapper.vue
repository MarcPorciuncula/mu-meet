<template>
  <div class="nprogress-wrapper">
    <component :is="root">
      <router-view slot="header-bar-control" name="app-bar-control"></router-view>
      <router-view />
    </component>
    <error-dialog />
  </div>
</template>

<script>
import nprogress from 'nprogress';
import AppShell from './AppShell';
import ErrorDialog from '@/components/ErrorDialog';
import {
  SHOW_PROGRESS_BAR_AT,
  WATCH_PROGRESS_INCREMENT,
} from '@/store/getters';

export default {
  components: {
    AppShell,
    ErrorDialog,
  },
  data() {
    return {
      now: performance.now(),
      inProgress: false,
    };
  },
  created() {
    setInterval(() => {
      this.now = performance.now();
    }, 100);
  },
  computed: {
    root() {
      if (this.$route.meta.shell) {
        return 'AppShell';
      }
      return 'div';
    },
    showProgressBarAt() {
      return this.$store.getters[SHOW_PROGRESS_BAR_AT];
    },
    increment() {
      return this.$store.getters[WATCH_PROGRESS_INCREMENT];
    },
  },
  mounted() {
    nprogress.configure({ parent: '.nprogress-wrapper', showSpinner: false });
  },
  watch: {
    showProgressBarAt() {
      this.update();
    },
    now() {
      this.update();
    },
    increment() {
      nprogress.inc();
    },
  },
  methods: {
    update() {
      if (!this.showProgressBarAt) {
        nprogress.done();
        this.inProgress = false;
      } else if (this.now > this.showProgressBarAt && !this.inProgress) {
        nprogress.start();
        this.inProgress = true;
      }
    },
  },
};
</script>

<style>
@import '~nprogress/nprogress.css';
</style>
