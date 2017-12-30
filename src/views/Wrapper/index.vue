<template>
  <div class="min-vh-100 relative sans bg-blue-grey-50 flex flex-column">
    <main class="flex flex-column min-vh-90" style="flex-grow: 1">
      <router-view></router-view>
    </main>
    <router-view name="footer"></router-view>
    <ErrorDialog/>
  </div>
</template>

<script>
import ErrorDialog from '@/views/ErrorDialog';

export default {
  name: 'Wrapper',
  components: {
    ErrorDialog,
  },
};
</script>
