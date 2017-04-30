<template>
  <div class="wrapper">
    <welcome-splash></welcome-splash>
    <div class="footer">
      <p>
        Design and development by<br/> <a class="author-link" href="https://github.com/MarcoThePoro">Marc Porciuncula</a> and <a class="author-link">Kalana Vithana</a><br/>
        Second runner up in <b>Unihack Mini 2017</b><br/>
        Made with &lt;3 in Melbourne Australia<br/>
        <a href="https://github.com/MarcoThePoro/mu-meet">View source on GitHub</a>
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

}

.author-link, b {
  font-weight: 500;
}
</style>
