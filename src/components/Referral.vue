<template>
  <div>
    <full-header></full-header>
    <div class='center' style='padding-top:10px'>
      <p class = 'text'> joining a session hosted by:</p>
      <p class='center host'>Marc Porciuncula</p>
    </div>
    <calendar-auth></calendar-auth>
    <fixed-footer></fixed-footer>
  </div>
</template>

<script>
import FullHeader from './FullHeader';
import FixedFooter from './FixedFooter';
import CalendarAuth from './CalendarAuth';
export default {
  components: {
    FullHeader,
    FixedFooter,
    CalendarAuth,
  },
};
</script>
<style scoped>
.center {
  display: flex;
  flex-direction:column;
  align-items: center;
}
.host {
  font-size: 120%;
  margin: 0px;
  color: #90A4AE;
}
.text {
  font-weight: bold;
  font-size: 120%;
  margin: 10px;
}
</style>
