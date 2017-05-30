<template>
  <page>
    <template>
      <p>is your team ready to begin?<br/>start a live scheduling session</p>
      <user-action v-on:click="create()">Create session</user-action>
      <p>already have a session?<br/>enter your session code</p>
      <md-input-container>
        <label for="session-code">
          Session code
        </label>
        <md-input v-model="sessionId" />
      </md-input-container>
      <user-action v-on:click="join()">
        Join session
      </user-action>
    </template>
  </page>
</template>

<script>
import Vue from 'vue';
import { MdCore, MdInputContainer } from 'vue-material';
import 'vue-material/dist/components/MdInputContainer/index.css';
import Page from './Page';
import UserAction from './UserAction';
import store from '@/store';

Vue.use(MdCore);
Vue.use(MdInputContainer);

export default {
  components: {
    Page,
    UserAction,
  },
  data() {
    return {
      sessionId: '',
    };
  },
  async beforeRouteEnter(to, from, next) {
    if (to.query.id) {
      await store.dispatch('joinSchedulingSession', to.query.id);
      await store.dispatch('refreshSchedulingSessionStatus');
      await store.dispatch('subscribeSchedulingSessionStatus');
      next({ path: 'session' });
    } else {
      next();
    }
  },
  async created() {
    if (this.$store.state.scheduling.isInSession) {
      await this.$router.push(
        `/session?id=${this.$store.state.scheduling.session.id}`,
      );
    }
  },
  methods: {
    async create() {
      this.$store.dispatch('addProgressItem', {
        id: 'CREATE_SCHEDULING_SESSION',
        message: 'Creating session',
      });
      await this.$store.dispatch('createSchedulingSession');
      await this.$store.dispatch('refreshSchedulingSessionStatus');
      await this.$store.dispatch('subscribeSchedulingSessionStatus');
      this.$store.dispatch('removeProgressItem', 'CREATE_SCHEDULING_SESSION');
      await this.$router.push(
        `/session/lobby?id=${this.$store.state.scheduling.session.id}`,
      );
    },
    async join() {
      await this.$store.dispatch('joinSchedulingSession', this.sessionId);
      await this.$store.dispatch('refreshSchedulingSessionStatus');
      await this.$store.dispatch('subscribeSchedulingSessionStatus');
      await this.$router.push(
        `/session/lobby?id=${this.$store.state.scheduling.session.id}`,
      );
    },
  },
};
</script>
