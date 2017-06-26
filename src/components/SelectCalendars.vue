<template>
  <layout-section>
    <layout-container padding="min">
      <mdc-list>
        <mdc-list-item
          v-for="calendar of calendars"
          class="menu-item"
          :text="calendar.summary"
          truncate
        >
          <div
            slot="start-detail"
            class="calendar-dot"
            :style="`background-color: ${calendar.backgroundColor}`"
          ></div>
          <div slot="end-detail">
            <mdc-checkbox
              :value="calendar.selected"
              @change="updateCalendarSelected({ id: calendar.id, selected: $event })"
            />
          </div>
        </mdc-list-item>
      </mdc-list>
      <layout-container padding="min" style="text-align: right">
        <mdc-button class="confirm-button" @click="confirm">Confirm</mdc-button>
      </layout-container>
    </layout-container>
  </layout-section>
</template>

<script>
import { mapState } from 'vuex';
import LayoutSection from './Layout/Section';
import LayoutContainer from './Layout/Container';
import MdcList from './Material/List';
import MdcListItem from './Material/ListItem';
import MdcCheckbox from './MdcCheckbox';
import MdcButton from './Material/Button';
import dashboard from '@/router/dashboard';

export default {
  components: {
    MdcCheckbox,
    MdcButton,
    LayoutSection,
    LayoutContainer,
    MdcList,
    MdcListItem,
  },
  computed: mapState({
    calendars: state => state.calendars,
  }),
  methods: {
    updateCalendarSelected({ id, selected }) {
      this.$store.dispatch('updateCalendarSelected', { id, selected });
    },
    confirm() {
      this.$router.push(this.$route.query.callback || dashboard.path);
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
  // max-width: 100%;
  // width: 100%;
}

.calendar-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
</style>
