<template>
  <div>
    <layout-section>
      <layout-container>
        <type-container>
          <type-text tag="p" type="body1">
            Invite your team with the link below. Make sure everyone selects their calendars, then press find meeting times. If someone updates their calendar selection or a new member is added, you'll need to manually find meeting times again.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-section>
      <layout-container padding="min">
        <mdc-list-group>
          <mdc-list>
            <mdc-list-item multiline ripple @click="copyInviteLink">
              <span slot="start-detail" class="material-icons">
                group_add
              </span>
              Invite your team
              <span slot="secondary-text" ref="inviteLink">
                {{ inviteLink }}
              </span>
            </mdc-list-item>
            <mdc-list-item multiline ripple @click="showParameters = true">
              <span slot="start-detail" class="material-icons">
                tune
              </span>
              Change parameters
              <span slot="secondary-text">
                At least 30 min
                from {{ session.config.searchFromHour | formatHour }}
                to {{ session.config.searchToHour | formatHour }}
                on weekdays,
                over {{ session.config.searchFromDate | format('ddd DD MMM') }}
                to {{ session.config.searchToDate | format('ddd DD MMM') }}.
              </span>
            </mdc-list-item>
            <router-link :to="{ name: calendarsRoute.name, query: { callback: $route.path } }">
              <mdc-list-item multiline ripple>
                <span slot="start-detail" class="material-icons">
                  event_note
                </span>
                Select your calendars
                <span slot="secondary-text">
                  {{ calendars.length || 'No' }} calendar{{ calendars.length === 1 ? '' : 's' }} selected
                </span>
              </mdc-list-item>
            </router-link>
          </mdc-list>
          <mdc-list-group-divider />
          <mdc-list>
            <mdc-list-item ripple @click="findMeetingTimes()">
              <span slot="start-detail" class="material-icons">
                event
              </span>
              Find meeting times
            </mdc-list-item>
          </mdc-list>
        </mdc-list-group>
      </layout-container>
    </layout-section>
    <team-list />
    <parameters v-if="showParameters" :done="hideParameters"/>
    <meeting-times/>
    <layout-section padding="normal">
      <layout-container padding="min">
        <mdc-list-group>
          <mdc-list-group-divider />
          <mdc-list>
            <mdc-list-item ripple @click="archive()">
              <span slot="start-detail" class="material-icons">
                archive
              </span>
              Archive meeting plan
            </mdc-list-item>
          </mdc-list>
        </mdc-list-group>
      </layout-container>
    </layout-section>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import format from 'date-fns/format';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroup as MdcListGroup,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';
import TeamList from './TeamList';
import MeetingTimes from './MeetingTimes';
import Parameters from './MeetingParameters';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupDivider,
    TeamList,
    MeetingTimes,
    Parameters,
  },
  props: {
    inviteLink: VueTypes.string.isRequired,
    calendars: VueTypes.arrayOf(
      VueTypes.shape({
        id: VueTypes.string,
      }).loose,
    ).isRequired,
    calendarsRoute: VueTypes.shape({ name: VueTypes.string.isRequired }).loose
      .isRequired,
    findMeetingTimes: VueTypes.func.isRequired,
    archive: VueTypes.func.isRequired,
    session: VueTypes.shape({
      config: VueTypes.shape({
        searchFromDate: VueTypes.oneOfType([Date]).isRequired,
        searchToDate: VueTypes.oneOfType([Date]).isRequired,
      }).loose.isRequired,
    }).loose.isRequired,
  },
  methods: {
    copyInviteLink(event) {
      if (event.srcElement === this.$refs.inviteLink) {
        // The user was likely trying to copy the text manually
        return;
      }
      const selection = window.getSelection();
      selection.empty();
      const range = document.createRange();
      range.setStart(this.$refs.inviteLink, 0);
      range.setEnd(this.$refs.inviteLink, 1);
      selection.addRange(range);
    },
    setHours,
    hideParameters() {
      this.showParameters = false;
    },
  },
  data() {
    return {
      showParameters: false,
    };
  },
  filters: {
    format,
    formatHour(hours) {
      const minutes = hours % 1 * 60;
      let date = new Date();
      date = setMinutes(date, minutes);
      date = setHours(date, hours);
      return format(date, 'h:mma');
    },
  },
};
</script>

<style scoped lang="scss">
</style>
