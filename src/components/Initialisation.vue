<template>
  <div>
    <full-header></full-header>
    <p class="center">create or join a session to begin</p>

    <!--Insert button "CREATE SESSION" here -->
    <div class="altcenter">
      <div class="sessionButton">
        <ui-button :raised="true" v-on:click="createSession()">Create Session</ui-button>
      </div>
      <div class="sessionCode">
        <ui-textbox v-model="sessionIdInput" :floating-label="true" label="Already have a session code?"></ui-textbox>
      </div>
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
  data() {
    return {
      sessionIdInput: '',
    };
  },
  computed: {
    isInSession() {
      return this.$store.state.session.isInSession;
    },
  },
  methods: {
    createSession() {
      this.$store.dispatch('createSession');
    },
    joinSession() {
      this.$store.dispatch('joinSession', this.sessionIdInput); // TODO failure state
    },
  },
  watch: {
    isInSession(isInSession) {
      if (isInSession) {
        this.$router.push(`/room?id=${this.$store.state.session.id}`);
      }
    },
  },
};
</script>

<style scoped>
.center{
  display: flex;
  justify-content: center;
  padding-top: 10vh;
  font-size: 30px;
}
.sessionCode {
  width: 300px;
  padding-top: 50px;
}
.altcenter {
  display: flex;
  flex-direction:column;
  align-items: center;
}
</style>
