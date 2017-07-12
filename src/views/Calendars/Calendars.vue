<template>
  <div>
    <sync-timetable v-if="promptSyncTimetable" />
    <calendar-select />
  </div>
</template>

<script>
import SyncTimetable from './SyncTimetable';
import CalendarSelect from './CalendarSelect';
import { CALENDARS, USER_PROFILE } from '@/store/getters';
import { mapGetters } from 'vuex';

export default {
  components: {
    SyncTimetable,
    CalendarSelect,
  },
  computed: {
    ...mapGetters({
      calendars: CALENDARS,
      profile: USER_PROFILE,
    }),
    promptSyncTimetable() {
      return (
        !Object.values(this.calendars).find(calendar =>
          calendar.summary.toLowerCase().match(/timetable/),
        ) &&
        this.profile &&
        this.profile.email &&
        this.profile.email.endsWith('@student.monash.edu')
      );
    },
  },
};
</script>
