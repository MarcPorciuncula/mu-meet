<template>
  <div>
    <layout-section>
      <layout-container padding="normal">
        <type-container>
          <type-text tag="p" type="headline">
            Find a time to meet in four steps.
          </type-text>
          <type-text tag="p" type="body1">
            Make sure to check you have the right calendars enabled.
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <mdc-list-group>
          <mdc-list actionable>
            <router-link :to="{ name: calendarsRoute.name, query: { callback: $route.path } }">
              <mdc-list-item ripple>
                <span slot="start-detail">
                  1.
                </span>
                <span>
                  Select your calendars
                </span>
                <span class="material-icons" slot="end-detail">
                  event_note
                </span>
              </mdc-list-item>
            </router-link>
            <mdc-list-item ripple @click="scrollTo('team')">
              <span slot="start-detail">
                2.
              </span>
              <span>
                Invite team members
              </span>
              <span class="material-icons" slot="end-detail">
                group_add
              </span>
            </mdc-list-item>
            <mdc-list-item ripple @click="scrollTo('parameters')">
              <span slot="start-detail">
                3.
              </span>
              <span>
                Change parameters
              </span>
              <span class="material-icons" slot="end-detail">
                tune
              </span>
            </mdc-list-item>
            <mdc-list-item separator />
            <mdc-list-item ripple @click="scrollTo('meetings')">
              <span slot="start-detail">
                4.
              </span>
              <span>
                Find meeting times
              </span>
              <span class="material-icons" slot="end-detail">
                event
              </span>
            </mdc-list-item>
          </mdc-list>
        </mdc-list-group>
      </layout-container>
    </layout-section>
    <layout-section padding="normal" ref="team">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="subheading2">
            Team
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <team-list />
      </layout-container>
    </layout-section>
    <layout-section padding="normal" ref="parameters">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="subheading2">
            Parameters
          </type-text>
          <type-text tag="p" type="headline">
            At least 30 min
            from {{ session.config.searchFromHour | formatHour }}
            to {{ session.config.searchToHour | formatHour }}
            on weekdays,
            over {{ session.config.searchFromDate | format('ddd DD MMM') }}
            to {{ session.config.searchToDate | format('ddd DD MMM') }}.
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <parameters ref="parameters"/>
      </layout-container>
    </layout-section>
    <layout-section padding="normal" ref="meetings">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="subheading2">
            Meeting Times
          </type-text>
          <type-text tag="p" type="headline" v-if="session.result.status === 'DONE'">
            You have {{ session.result.meetings.length }} possible meeting times.
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <meeting-times />
      </layout-container>
    </layout-section>
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
import Vue from 'vue';
import VueTypes from 'vue-types';
import format from 'date-fns/format';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import CopyText from '@/components/CopyText';
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
    CopyText,
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
      this.$refs.inviteLink.copy();
    },
    setHours,
    scrollTo(name) {
      Vue.nextTick(() => {
        this.$refs[name].$el.scrollIntoView({ behavior: 'smooth' });
      });
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
.inline-icon {
  font-size: 120%;
  transform: translateY(20%);
}
</style>
