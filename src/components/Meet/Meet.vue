<template>
  <div>
    <layout-section>
      <layout-container>
        <type-container>
          <type-text tag="p" type="body1">
            Invite your team with the link below. Make sure everyone selects their calendars then press find meeting times. If someone updates their calendars selection or a new memeber is added, you'll need to manually find meeting times again.
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-section>
      <layout-container padding="min">
        <mdc-list>
          <mdc-list-item multiline ripple @click="copyInviteLink">
            <span slot="start-detail" class="material-icons">
              group_add
            </span>
            Invite your team
            <span slot="secondary-text" ref="inviteLink">
              <span class="hidden">http://</span>{{ inviteLink }}
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
          <mdc-list-item multiline ripple>
            <span slot="start-detail" class="material-icons">
              event_note
            </span>
            Select your calendars
            <span slot="secondary-text">
              2 calendars selected
            </span>
          </mdc-list-item>
          <mdc-list-item separator />
          <mdc-list-item ripple>
            <span slot="start-detail" class="material-icons">
              event
            </span>
            Find meeting times
          </mdc-list-item>
        </mdc-list>
      </layout-container>
    </layout-section>
    <layout-section padding="normal">
      <layout-container>
        <type-container>
          <type-text tag="h3" type="subheading2" style="margin-bottom: 0">
            Team
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <mdc-list>
          <mdc-list-item>
            <img slot="avatar" src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"/>
            Marc Porciuncula
            <span slot="secondary-text">
              mpor14@student.monash.edu
            </span>
          </mdc-list-item>
        </mdc-list>
      </layout-container>
    </layout-section>
    <layout-section padding="normal">
      <layout-container>
        <type-container>
          <type-text tag="h3" type="subheading2">
            Meeting times
          </type-text>
        </type-container>
      </layout-container>
      <layout-container padding="min">
        <mdc-list-group>
          <mdc-list-group-header>
            Mon 5th Jun
          </mdc-list-group-header>
          <mdc-list>
            <mdc-list-item>
              9:00am to 9:30am
              <span slot="secondary-text">
                Half an hour
              </span>
            </mdc-list-item>
          </mdc-list>
          <mdc-list-group-divider />
          <mdc-list-group-header>
            Fri 10th Jun
          </mdc-list-group-header>
          <mdc-list>
            <mdc-list-item>
              9:00am to 9:30am
              <span slot="secondary-text">
                Half an hour
              </span>
            </mdc-list-item>
            <mdc-list-item>
              12:00pm to 4:00pm
              <span slot="secondary-text">
                4 hours
              </span>
            </mdc-list-item>
          </mdc-list>
        </mdc-list-group>
      </layout-container>
    </layout-section>
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
  ListGroupHeader as MdcListGroupHeader,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupHeader,
    MdcListGroupDivider,
  },
  props: {
    inviteLink: VueTypes.string.def('localhost:8080/#/meet/ByZuQGuGb'), // FIXME make this required
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
      range.setEnd(this.$refs.inviteLink, 2);
      selection.addRange(range);
    },
  },
};
</script>

<style scoped lang="scss">
</style>
