<template>
  <layout-section>
    <layout-container padding="less">
      <mdc-list>
        <mdc-list-item v-for="calendar of calendars" class="menu-item">
          <div
            class="mdc-list-item__start-detail calendar-dot"
            :style="`background-color: ${calendar.backgroundColor}`"
          >
          </div>
          <span class="calendar-name">{{ calendar.summary }}</span>
          <div class="mdc-list-item__end-detail">
            <mdc-checkbox
              :value="calendar.selected"
              @change="updateCalendarSelected({ id: calendar.id, selected: $event })"
            />
          </div>
        </mdc-list-item>
      </mdc-list>
      <div style="text-align: right">
        <mdc-button class="confirm-button" @click="confirm">Confirm</mdc-button>
      </div>
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

.confirm-button {
  margin-top: 3rem;
}

.mdc-list-item__start-detail.calendar-dot {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.calendar-name {
  text-overflow: ellipsis;
  overflow-y: hidden;
  white-space: nowrap;
  max-width: calc(100% - 5rem);
}
</style>
