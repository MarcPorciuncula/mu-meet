<template>
  <section>
    <h2 class="section_headline">
      Select Calendars
    </h2>
    <p>
      Select the calendars you would like to schedule around.
    </p>
    <ul class="mdc-list mdc-list--dense">
      <li v-for="calendar of calendars" class="mdc-list-item menu-item">
        <div
          class="mdc-list-item__start-detail calendar-dot"
          :style="`background-color: ${calendar.backgroundColor}`"
        >
        </div>
        {{ calendar.summary }}
        <div class="mdc-list-item__end-detail">
          <mdc-checkbox
            :value="calendar.selected"
            @change="updateCalendarSelected({ id: calendar.id, selected: $event })"
          />
        </div>
      </li>
    </ul>
    <div style="text-align: right">
      <mdc-button class="confirm-button" @click="confirm">Confirm</mdc-button>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import store from '@/store';
import MdcCheckbox from './MdcCheckbox';
import MdcButton from './MdcButton';
import dashboard from '@/router/dashboard';

export default {
  components: {
    MdcCheckbox,
    MdcButton,
  },
  async beforeRouteEnter(to, from, next) {
    if (!Object.keys(store.state.calendars).length) {
      await store.dispatch('fetchCalendars');
    }
    next();
  },
  computed: mapState({
    calendars: state => state.calendars,
  }),
  methods: {
    ...mapActions(['updateCalendarSelected']),
    confirm() {
      this.$router.push(dashboard.path);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/list/mdc-list';

.calendar-select {
  display: flex;
  flex-direction: column;
  color: black;
  font-size: 2rem;
}

.mdc-list {
  font-size: 1.6rem;
  font-family: inherit;
  line-height: 1.75em;
  letter-spacing: 0.02em;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}

.mdc-checkbox {
  margin: -10px 0 0 -10px;
}

.mdc-list-item {
  overflow: visible;
}

section {
  padding: 0 2.5rem;
}

.confirm-button {
  background-color: #039BE5;
  color: white;
  margin-top: 3rem;
}

.mdc-list-item__start-detail.calendar-dot {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  margin-right: 1rem;
}
</style>
