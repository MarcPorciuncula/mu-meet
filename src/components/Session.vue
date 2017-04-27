<template>
  <div>
    <!-- <h1 class='center header'>MUmeet</h1> -->
    <!--to be shown: regular user -->
    <!-- <p class = 'center text'> your session is hosted by:</p>
    <p class ='center host'>Marc Porciuncula</p> -->

    <!--to be shown: session host -->
    <p class = 'host center' style='font-size:16px'>Your session code is: {{ sessionId }}</p>
    <p class = 'text center'> invite your team by sharing this link: </p>
    <div style="display: flex; justify-content: space-around">
      <ui-textbox :value="'mumeet.surge.sh/#' + path" v-on:change.prevent="" style="width: 310px"></ui-textbox>
    </div>
    <!-- session url in text input -->

<!--
    <ui-select :floating-label="true" label="minimum meeting length"></ui-select>
    <ui-select :floating-label="true" label="search in"> </ui-select> -->

    <div class='sessioncontainer center'>
      <p>{{ nUsers }} in session</p>
      <div class='membersession center'>
        <div v-for="user, uid in users">
          {{ user.data.displayName }}
          <span v-if="uid === host">(Host)</span>
          <span v-if="user.phase === 'WAIT'">Ready</span>
          <span v-else>...</span>
        </div>
      </div>
    </div>
  <div class='center' style='padding-top:30px'>
    <ui-button v-if="isHost || calculating" :disabled="(!ready) || calculating" v-on:click="calculate" :loading="calculating">Calculate a time</ui-button>
  </div>

  </div>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.fullPath;
    },
    sessionId() {
      return this.$route.query.id;
    },
    host() {
      return this.$store.state.session.host;
    },
    hostUsername() {
      return this.$store.state.session.users[this.host].data.displayName;
    },
    users() {
      return this.$store.state.session.users;
    },
    nUsers() {
      return Object.keys(this.$store.state.session.users).length;
    },
    ready() {
      const nReady = Object.values(this.users).filter(
        user => user.phase === 'WAIT',
      ).length;
      return nReady === Object.values(this.users).length;
    },
    isHost() {
      return this.$store.state.session.isHost;
    },
    calculating() {
      return this.$store.state.session.computing;
    },
  },
  methods: {
    calculate() {
      this.$store.dispatch('generateFreeTimes');
    },
  },
};
</script>

<style scoped>
.header {
  padding-top: 15px;
  padding-bottom: 10px;
}
h1 {
    font-size:30px;
    margin-bottom:10px;
}
.center {
  display: flex;
  flex-direction:column;
  align-items: center;
}
.host {
  font-size: 20px;
  margin: 5px;
  color: #90A4AE;
}
/*idk how to do this
.membersession {
  width: 100px;
  length: 100px;
  background-color:black;
}
.membercontainer {
  display:flex;
  flex-direction: column;
  align-items:center;
}
*/
.text {
  font-size: 120%;
  margin: 0px;
}
</style>
