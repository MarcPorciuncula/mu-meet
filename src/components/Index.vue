<template>
  <div class="wrapper">
    <welcome-splash></welcome-splash>
    <div class="footer">
      <p>
        Design and development by<br/> <b>Marc Porciuncula</b> and <b>Kalana Vithana</b><br/>
        Second runner up in <b>Unihack Mini 2017</b><br/>
        Made with &lt;3 in Melbourne Australia
      </p>
    </div>
  </div>
</template>

<script>
import WelcomeSplash from './WelcomeSplash';

export default {
  components: {
    WelcomeSplash,
  },
};
</script>

<style scoped lang="scss">
.footer {
  color: #FFFFFF;
  background-color: #4F4F4F;
  padding: 1rem 1rem 2rem 1rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: 300;

  b {
    font-weight: 500;
  }
}
</style>
