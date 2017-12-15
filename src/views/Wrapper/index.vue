<template>
  <div class="min-vh-100 relative sans bg-grey-100 flex flex-column">
    <main class="flex flex-column min-vh-90" style="flex-grow: 1">
      <router-view></router-view>
    </main>
    <PageFooter/>
    <ErrorDialog/>
  </div>
</template>

<script>
import ProgressBar from '@/components/GlobalProgressBar';
import PageFooter from '@/views/Footer';
import ErrorDialog from '@/views/ErrorDialog';

export default {
  components: {
    PageFooter,
    ProgressBar,
    ErrorDialog,
  },
};
</script>
