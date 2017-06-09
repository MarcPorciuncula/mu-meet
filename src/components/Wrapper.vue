<template>
  <div class="nprogress-wrapper">
    <component :is="root">
      <router-view slot="header-bar-control" name="app-bar-control"></router-view>
      <router-view />
    </component>
  </div>
</template>

<script>
import nprogress from 'nprogress';
import AppShell from './AppShell';

export default {
  components: {
    AppShell,
  },
  computed: {
    root() {
      if (this.$route.meta.shell) {
        return 'AppShell';
      }
      return 'div';
    },
  },
  mounted() {
    nprogress.configure({ parent: '.nprogress-wrapper', showSpinner: false });
  },
};
</script>

<style>
@import '~nprogress/nprogress.css';
</style>
