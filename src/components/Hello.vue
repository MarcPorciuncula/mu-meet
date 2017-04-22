<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button v-on:click="login()">Log in with google</button>
    <p v-if="user">Logged in</p>
    <button v-on:click="doit">Do it</button>
  </div>
</template>

<script>
import * as firebase from 'firebase';

import getGoogle from '../gapi';

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      user: null,
    };
  },
  async created() {
    this.auth = firebase.auth();
    this.loginProvider = new firebase.auth.GoogleAuthProvider();
    this.loginProvider.addScope('https://www.googleapis.com/auth/calendar');
    this.auth.onAuthStateChanged(user => this.handleAuthStateChanged(user));

    const google = await getGoogle();
    console.log(
      'listener',
      google.auth2.getAuthInstance().isSignedIn.listen(res => {
        console.log('signed in', res);
        console.log(
          google.auth2.getAuthInstance().currentUser.get().getAuthResponse()
            .id_token,
        );
        // this.loginProvider.credential()
      }),
    );
    console.log(google.auth2.getAuthInstance().isSignedIn.get());
  },
  methods: {
    async login() {
      const google = await getGoogle();
      google.auth2.getAuthInstance().signIn();
      // try {
      //   const user = await this.auth.signInWithPopup(this.loginProvider);
      //   this.handleAuthStateChanged(user.user);
      // } catch (err) {
      //   console.error(err);
      // }
    },
    handleAuthStateChanged(user) {
      if (user) {
        // console.log(getAuth().checkSessionState());
        this.user = {};
      } else {
        this.user = null;
      }
    },
    async doit() {
      const google = await getGoogle();
      // google.auth2.getAuthInstance().signOut();
      const result = await google.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      });
      console.log(JSON.parse(result.body));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
