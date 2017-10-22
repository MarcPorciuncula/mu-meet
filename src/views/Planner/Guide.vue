<template>
  <layout-section padding="less">
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
          <mdc-list-item ripple @click="$emit('change-tab', 'team')">
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
          <mdc-list-item ripple @click="$emit('change-tab', 'parameters')">
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
          <mdc-list-item ripple @click="$emit('request-result')">
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
</template>

<script>
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroup as MdcListGroup,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';
import calendarsRoute from '@/router/user/calendars';

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
  },
  computed: {
    calendarsRoute: () => calendarsRoute,
  },
};
</script>
