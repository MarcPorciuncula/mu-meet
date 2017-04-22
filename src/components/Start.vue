<template>
  <div>
    <button v-if="!isSignedIn" v-on:click="login()">Sign In With Google</button>
    <template v-if="isSignedIn">
      <button v-on:click="logout()">Sign Out</button>
      <button v-on:click="createSession()">Create Session</button>
      <p>Calendars found:</p>
      <ul>
        <li v-for="calendar in calendars">
          {{ calendar.summary }}
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: 'start',
  computed: {
    isSignedIn() {
      return this.$store.state.auth.isSignedIn;
    },
    calendars() {
      return this.$store.state.calendar.calendars;
    },
  },
  created() {
    this.$store.dispatch('refreshSignInStatus');
  },
  methods: {
    login() {
      this.$store.dispatch('signIn');
    },
    logout() {
      this.$store.dispatch('signOut');
    },
    createSession() {
      this.$store.dispatch('getCalendars');
    },
  },
};
</script>

<style>

</style>
