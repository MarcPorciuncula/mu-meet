<template>
  <div class="" style="flex-grow: 1">
    <div class="bg-white flex flex-column items-center">
      <HeaderBar>
        <ProfilePictureForCurrentUser class="f5" style="width: 1.8rem; height: 1.8rem" />
      </HeaderBar>
      <div class="mw8 w-100 mt4-ns mb3 pa3 pb6">
        <h2 class="f3 fw5 lh-title mt0">Manage calendars</h2>
        <p class="f5 lh-copy grey-600 measure-narrow">
          Choose which calendars to consider when finding meeting times.
        </p>
        <div class="mv2 grey-800">
          <router-link
            :to="{ name: 'dashboard' }"
            class="f5 lh-copy"
          >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              chevron_left
            </span>
            <span class="bb">
              Back
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex flex-column items-center mtn6 mb4">
      <div class="mw7 w-100 ph3">
        <h3 class="f6 fw5 grey-600 lh-title">
          Your calendars
        </h3>
        <div class="bg-white br2 br--bottom elevate1 mb3">
          <MdcList
            separated
          >
            <MdcListItem
              v-for="calendar of calendars"
              class=""
              :text="formatCalendarName(calendar.summary)"
              :key="calendar.id"
              truncate
            >
              <CalendarDot
                slot="start-detail"
                :color="calendar.backgroundColor"
              />
              <div slot="end-detail">
                <MdcCheckbox
                  :style="{
                    margin: '-0.5rem 0 0 -0.5rem',
                    '--mdc-theme-secondary': calendar.backgroundColor
                  }"
                  :value="calendar.selected"
                  @change="updateCalendarSelected({ id: calendar.id, selected: $event })"
                />
              </div>
            </MdcListItem>
          </MdcList>
        </div>
        <div class="bg-white br2 br--bottom elevate1 pa3 pt2 mb3 grey-800">
          <h4 class="f3 fw3 lh-copy mv2 lh-title">
            Sync your Monash Timetable
          </h4>
          <p class="f6 lh-copy measure">
            Don't have your Monash timetable synced yet?
          </p>
          <ol class="f6 lh-copy measure pl3 mb0">
            <li class="mb3">
              Visit My Monash Calendar Feeds and copy the link to your timetable calendar feed.
              <br/>
              <a
                class="f6 lh-copy"
                href="https://my.monash.edu.au/news-and-events/calendar-feeds/direct.html"
                rel="noopener"
                target="_blank"
              >
                <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
                  event_note
                </span>
                <span class="bb">
                  My Monash Calendar Feeds
                </span>
            </a>
            </li>
            <li class="mb3">
              Use this link to add a calendar to Google Calendar.<br/>
              <a
                class="f6 lh-copy"
                href="https://calendar.google.com/calendar/r/settings/addbyurl"
                rel="noopener"
                target="_blank"
              >
                <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
                  add_to_photos
                </span>
                <span class="bb">
                  Google Calendar - Add by URL
                </span>
              </a>
            </li>
            <li class="mb3">
              Sync your calendars to MUmeet.<br/>
              <button
                :class="['bn bg-transparent di lh-copy sans pa0 action', syncing ? 'grey-400' : 'grey-900']"
                @click="syncCalendars()"
                >
                <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
                  sync
                </span>
                <span class="bb">
                  Sync calendars
                </span>
              </button>
            </li>
          </ol>
        </div>
        <div class="pv1">
          <p class="f6 grey-600 lh-copy measure mt0 mb1">Added, removed or modified your Google Calendars?<br/>Sync calendars to have them appear here.</p>
          <button
            :class="['f5 bn bg-transparent di lh-copy sans pa0 action', syncing ? 'grey-400' : 'grey-900']"
            @click="syncCalendars()"
            >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              sync
            </span>
            <span class="bb">
              Sync calendars
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderBar from '@/views/HeaderBar';
import ProfilePictureForCurrentUser from '@/views/ProfilePicture/ForCurrentUser';
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/ListItem';
import MdcCheckbox from '@/components/Material/Checkbox';
import MdcButton from '@/components/Material/Button';
import CalendarDot from '@/components/CalendarDot';
import {
  USER_PROFILE,
  CALENDARS,
  CALENDARS_PENDING_OPS,
} from '@/store/getters';
import {
  FETCH_USER_PROFILE,
  SYNC_CALENDARS,
  ENABLE_DISABLE_CALENDAR,
} from '@/store/actions';

export default {
  name: 'Calendars',
  components: {
    HeaderBar,
    ProfilePictureForCurrentUser,
    MdcList,
    MdcListItem,
    MdcCheckbox,
    MdcButton,
    CalendarDot,
  },
  created() {
    if (!this.$store.getters[USER_PROFILE]) {
      this.$store.dispatch(FETCH_USER_PROFILE);
    }
  },
  computed: {
    user() {
      return { profile: this.$store.getters[USER_PROFILE] };
    },
    ...mapGetters({
      calendars: CALENDARS,
    }),
    syncing() {
      return this.$store.getters[CALENDARS_PENDING_OPS][SYNC_CALENDARS];
    },
  },
  methods: {
    formatCalendarName(name) {
      if (name === this.user.profile.email) {
        return 'Primary';
      } else {
        return name;
      }
    },
    syncCalendars() {
      if (!this.syncing) {
        this.$store.dispatch(SYNC_CALENDARS);
      }
    },
    updateCalendarSelected({ id, selected }) {
      this.$store.dispatch(ENABLE_DISABLE_CALENDAR, { id, enabled: selected });
    },
  },
};
</script>

<style scoped lang="scss">
.action {
  &:active {
    outline: initial;
  }
}
</style>
