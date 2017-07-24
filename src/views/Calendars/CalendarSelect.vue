<template>
  <layout-section padding="normal">
    <layout-container padding="normal">
      <type-container>
        <type-text tag="h3" type="subheading1">
          Select your calendars
        </type-text>
        <type-text tag="p" type="body1">
          These calendars will be used when comparing your free time to that of your teammates.
        </type-text>
      </type-container>
    </layout-container>
    <layout-container padding="min">
      <mdc-list>
        <mdc-list-item
          v-for="calendar of calendars"
          class="menu-item"
          :text="formatCalendarName(calendar.summary)"
          :key="calendar.id"
          truncate
        >
          <calendar-dot
            slot="start-detail"
            :color="calendar.backgroundColor"
          />
          <div slot="end-detail">
            <mdc-checkbox
              :value="calendar.selected"
              @change="updateCalendarSelected({ id: calendar.id, selected: $event })"
            />
          </div>
        </mdc-list-item>
      </mdc-list>
      <layout-section tag="div" padding="normal">
        <div v-if="Object.values(selectedCalendars).length" style="width: 100%; text-align: right; padding: 0 1rem">
          <mdc-button class="confirm-button" @click="confirm">Done</mdc-button>
        </div>
        <type-text v-else tag="p" type="body2">
          You must choose at least one calendar.
        </type-text>
      </layout-section>
    </layout-container>
    <layout-container padding="min">
      <mdc-list-group>
        <mdc-list-group-divider/>
        <mdc-list>
          <mdc-list-item @click="reSyncCalendars()">
            <span slot="start-detail" class="material-icons">
              sync
            </span>
            Re-sync my calendars
          </mdc-list-item>
        </mdc-list>
      </mdc-list-group>
    </layout-container>
  </layout-section>
</template>

<script>
import { mapGetters } from 'vuex';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import MdcList, {
  ListGroup as MdcListGroup,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';
import MdcListItem from '@/components/Material/ListItem';
import MdcCheckbox from '@/components/Material/Checkbox';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcButton from '@/components/Material/Button';
import CalendarDot from '@/components/CalendarDot';
import dashboard from '@/router/user/dashboard';
import { CALENDARS, SELECTED_CALENDARS, USER_PROFILE } from '@/store/getters';
import {
  SET_CALENDAR_SELECTED,
  FETCH_CALENDARS_TO_DATABASE,
} from '@/store/actions';

export default {
  components: {
    MdcCheckbox,
    MdcButton,
    LayoutSection,
    LayoutContainer,
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupDivider,
    TypeContainer,
    TypeText,
    CalendarDot,
  },
  computed: mapGetters({
    calendars: CALENDARS,
    selectedCalendars: SELECTED_CALENDARS,
    profile: USER_PROFILE,
  }),
  methods: {
    updateCalendarSelected({ id, selected }) {
      this.$store.dispatch(SET_CALENDAR_SELECTED, { id, selected });
    },
    reSyncCalendars() {
      this.$store.dispatch(FETCH_CALENDARS_TO_DATABASE);
    },
    confirm() {
      this.$router.push(this.$route.query.callback || dashboard.path);
    },
    formatCalendarName(name) {
      if (name === this.profile.email) {
        return 'Primary';
      } else {
        return name;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.mdc-checkbox {
  margin: -0.5rem 0 0 -0.5rem;
}

.mdc-list-item {
  overflow: visible;
}

.mdc-list-item__text {
  max-width: calc(100% - 10rem) !important;
}

.calendar-name {
  text-overflow: ellipsis;
  overflow-y: hidden;
  white-space: nowrap;
}
</style>
