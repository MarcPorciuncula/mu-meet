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
            <mdc-list-item multiline ripple>
              <span slot="start-detail" class="material-icons">
                tune
              </span>
              Change parameters (Coming soon)
              <span slot="secondary-text">
                At least 30 min from 9am to 5pm on weekdays, this week.
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
    <meeting-times />
  </div>
</template>

<script>
import VueTypes from 'vue-types';
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
  },
};
</script>

<style scoped lang="scss">
</style>
