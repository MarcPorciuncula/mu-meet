<template>
  <page>
    <p>
      <mumeet-logo></mumeet-logo> uses your Google Calendar to check your schedule.
    </p>
    <p>
      which calendars would you like to schedule around?
    </p>
    <div class="calendar-select">
      <div class="mdc-form-field" v-for="calendar of calendars" :key="calendar.id">
        <mdc-checkbox
          class="calendar-select_checkbox"
          v-model="selected[calendar.id]"
          :id="`calendar_${calendar.id}`"
          :key="calendar.id"
          :name="calendar.id"
        />
        <label :for="calendar.id">
          {{ calendar.summary }}
        </label>
      </div>
    </div>
    <p>
      ready to begin?
    </p>
    <user-action v-on:click="registerEvents()">
      continue
    </user-action>
  </page>
</template>

<script>
import Vue from 'vue';
import VueMDC from 'vue-mdc';
import 'vue-mdc/dist/vue-mdc.css';
import { mapState } from 'vuex';
import Page from './Page';
import MumeetLogo from './MumeetLogo';
import UserAction from './UserAction';
import store from '@/store';

Vue.use(VueMDC);

export default {
  components: {
    Page,
    MumeetLogo,
    UserAction,
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('fetchCalendars');
    next(vm => {
      vm.selected = store.state.calendar.selected || {};
    });
  },
  data() {
    return {
      selected: {},
    };
  },
  computed: mapState({
    calendars: state => state.calendar.calendars,
  }),
  methods: {
    async registerEvents() {
      await this.$store.dispatch('uploadSelectedCalendars', this.selected);
      await this.$store.dispatch('fetchCalendarEvents');
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect);
      } else {
        this.$router.push('/session');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-select {
  display: flex;
  flex-direction: column;
  color: black;
  font-size: 2rem;
}
</style>
