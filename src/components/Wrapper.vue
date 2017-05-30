<template>
  <div class="nprogress-wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
import nprogress from 'nprogress';
export default {
  mounted() {
    nprogress.configure({ parent: '.nprogress-wrapper' });
  },
};
</script>

<style>
@import '~nprogress/nprogress.css';
</style>
