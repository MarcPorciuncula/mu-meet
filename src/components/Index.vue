<template>
  <!-- main content -->
  <div class='body'>
   <div class='container-fluid title center'>
   <h1>MUmeet</h1>
   </div>
   <div class='container-fuild center'>
     <p class='subtitle'>
       a simple tool for scheduling group meetings.
     </p>
   </div>
   <div class='container-fuild center'>
     <p class='pre-footer'>
       made with ♥ for UniHack Mini '17
     </p>
     <ui-button v-on:click="login()" :loading="isSigningIn">
       Sign In with Google
     </ui-button>
   </div>
  <!-- fixed footer -->
  <p class='fixed-footer'>
    made by urMUm &nbsp&nbsp
   </p>
 </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('refreshSignInStatus');
  },
  computed: {
    isSigningIn() {
      return this.$store.state.auth.isSigningIn;
    },
    isSignedIn() {
      return this.$store.state.auth.isSignedIn;
    },
  },
  methods: {
    login() {
      this.$store.dispatch('signIn');
    },
  },
  watch: {
    isSignedIn(isSignedIn) {
      if (isSignedIn) {
        this.$router.push('/start');
      }
    },
  },
};
</script>


<style scoped>

.body {
  font-family: Muli,Monospace;
  color: #37474F;
}

h1 {
  font-size:50px;
  margin-bottom:10px;
}
.center {
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  flex-direction: column;
}
.title {
  padding-top: 20vh;
}
.subtitle {
  font-size: 25px;
  max-width: 500px;
  text-align: center;
}
.pre-footer {
  padding-top: 5vh;
  padding-bottom: 5vh;
}

.fixed-footer {
  height: 20px;
  background-color:#B0BEC5;
  position: fixed;
  display:flex;
  align-items: center;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom:0;
  font-family: Bitter,Georgia;
  font-size: 80%
}

</style>
