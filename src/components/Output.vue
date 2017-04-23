<template>
  <div>
    <full-header></full-header>
    <div class='center'>
    <p class='text center'>your reccomended meeting time is:</p>
    <p class='output'>10:00 am - 11:00 am <br> Tuesday </p>
    <ui-button color="primary">Add to Google Calendar</ui-button>
    <p class="alternatives"> show me some alternatives </p>
  </div>
  <fixed-footer></fixed-footer>
</div>

</template>

<script>
import FullHeader from './FullHeader';
import FixedFooter from './FixedFooter';
export default {
  components: {
    FullHeader,
    FixedFooter,
  },
};
</script>
<style scoped>
.center{
  display:flex;
  flex-direction: column;
  align-items: center;
}
.text{
  font-size: 20px;
}

.output{
  font-size: 30px;
  text-align: center;
}

.alternatives {
  padding-top:20px;
}
</style>
