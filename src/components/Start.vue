<template>
  <div>
    <button v-if="!isSignedIn" v-on:click="login()">Sign In With Google</button>
    <template v-if="isSignedIn">
      <button v-on:click="logout()">Sign Out</button>
      <hr/>
      <div>
        <button v-on:click="getCalendars()">Load Calendars</button>
        <p>Calendars found:</p>
        <ul>
          <li v-for="calendar in calendars" v-on:click="toggleSelectCalendar(calendar.id)">
            {{ calendar.summary }}
            <span v-if="selectedCalendars.includes(calendar.id)">
              (Selected)
            </span>
          </li>
        </ul>
        <button v-on:click="listEvents()">
          List events in this week from selected calendars
        </button>
      </div>
      <hr/>
      <div>
        <button v-on:click="createSession()">Create Session</button>
      </div>
      <hr/>
      <div>
        <input v-model="sessionIdInput" type="text" />
        <button v-on:click="joinSession()">Join Session</button>
      </div>
      <div v-if="isInSession">
        <p>The current invite code is {{ sessionId }}</p>
      </div>
      <hr/>
      <div>
        <button v-on:click="calculate()">Find free times</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'start',
  data() {
    return {
      sessionIdInput: '',
      selectedCalendars: [],
    };
  },
  computed: {
    isSignedIn() {
      return this.$store.state.auth.isSignedIn;
    },
    calendars() {
      return this.$store.state.calendar.calendars;
    },
    isInSession() {
      return this.$store.state.session.isInSession;
    },
    sessionId() {
      return this.$store.state.session.id;
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
    getCalendars() {
      this.$store.dispatch('getCalendars');
    },
    createSession() {
      this.$store.dispatch('createSession');
    },
    joinSession() {
      this.$store.dispatch('joinSession', this.sessionIdInput);
    },
    toggleSelectCalendar(id) {
      const index = this.selectedCalendars.indexOf(id);
      if (index > -1) {
        this.selectedCalendars.splice(index, 1);
      } else {
        this.selectedCalendars.push(id);
      }
    },
    listEvents() {
      this.$store.dispatch('loadCalendarEvents', this.selectedCalendars);
    },
    calculate() {
      this.$store.dispatch('getAllEvents');
    },
  },
};
</script>

<style>

</style>
