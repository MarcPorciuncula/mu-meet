<template>
  <page>
    <p>your session code is <u>{{ sessionId }}</u><br/>invite your team members with this link:</p>
    <md-input-container>
      <md-input :value="`${origin}/session?id=${sessionId}`" />
    </md-input-container>
    <p class="subtitle">
      Host:
    </p>
    <div class="user">{{ host.displayName }}</div>
    <p class="subtitle">
      Members:
    </p>
    <div v-for="user of members" class="user">
      {{ user.displayName }}
    </div>
    <template v-if="isHost">
      <p>
        ready to begin?<br/>
        <user-action v-on:click="advance()">
          continue
        </user-action>
      </p>
    </template>
    <p v-else>
      sit tight, your host will advance when ready
    </p>
  </page>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { MdCore, MdInputContainer } from 'vue-material';
import Page from './Page';
import UserAction from './UserAction';
import { PHASE_LOBBY } from '@/store/modules/scheduling';
import store from '@/store';

Vue.use(MdCore);
Vue.use(MdInputContainer);

export default {
  components: {
    Page,
    UserAction,
  },
  async beforeRouteEnter(to, from, next) {
    if (store.state.scheduling.session.phase !== PHASE_LOBBY) {
      next({ path: '/session' });
    } else {
      await store.dispatch(
        'fetchUsers',
        Object.keys(store.state.scheduling.session.users),
      );
      next();
    }
  },
  computed: mapState({
    sessionId: state => state.scheduling.session.id,
    hostId: state => state.scheduling.session.host,
    phase: state => state.scheduling.session.phase,
    isHost: state => state.scheduling.session.isHost,
    userIds: state => Object.keys(state.scheduling.session.users),
    users: state => state.users.users,
    origin() {
      return window.location.origin.match(/^https?:\/\/(.+)$/)[1] + '/#';
    },
    host() {
      return this.users[this.hostId] || {};
    },
    members() {
      return this.userIds
        .filter(id => id !== this.hostId)
        .map(id => this.users[id] || {});
    },
  }),
  watch: {
    userIds(userIds) {
      this.$store.dispatch('fetchUsers', userIds);
    },
    phase(phase) {
      if (phase !== PHASE_LOBBY) {
        this.$router.push({ path: `/session` });
      }
    },
  },
  methods: {
    advance() {
      this.$store.dispatch('advanceToConfigurePhase');
    },
  },
};
</script>

<style scoped lang="scss">
.subtitle {
  font-size: 1.6rem;
}

.user {
  color: black;
}
</style>
