<template>
  <div class="center">
    <p class='center head'>please select the calendars you wish to schedule around</p>
    <ul class="calendar-list">
      <li
        v-for="calendar of calendars"
        :class="['calendar', { 'calendar--selected': selected.includes(calendar.id) }]"
        :style="`background-color: ${calendar.backgroundColor}; color: ${calendar.foregroundColor}`"
        v-on:click="toggleSelectCalendar(calendar.id)"
      >
        {{ calendar.summary }}
      </li>
    </ul>
    <ui-button v-on:click="confirm()" :disabled="selected.length === 0" :loading="loading">
      Confirm
    </ui-button>
    <p class='center' style='font-size:16px; margin-top:0px;'>make sure your uni schedule is synced with one of these!</p>
    <p class='help center'><a href="https://my.monash.edu.au/news-and-events/calendar-feeds/direct.html">I haven't synced my calendar yet, help!</a></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      loading: false,
    };
  },
  created() {
    this.$store.dispatch('getCalendars');
  },
  computed: {
    calendars() {
      return this.$store.state.calendar.calendars;
    },
  },
  methods: {
    toggleSelectCalendar(id) {
      const index = this.selected.indexOf(id);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(id);
      }
    },
    async confirm() {
      this.loading = true;
      await this.$store.dispatch('loadCalendarEvents', this.selected);
      this.loading = false;
    },
  },
};
</script>

<style>
.center {
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  flex-direction: column;
}
.head {
  padding-top: 5px;
  font-size: 22px;
  margin-bottom: 5px;
}
.help {
  font-size: 14px;
  color: #90A4AE;
}

.calendar-list {
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  max-width: 400px;
}

.calendar {
  list-style: none;
  margin: 5px;
  padding: 10px;
  border-radius: 3px;
  transition: box-shadow 0.2s ease;
  width: 100%;
}

.calendar--selected {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
</style>
