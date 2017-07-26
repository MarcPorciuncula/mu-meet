<template>
  <div>
    <mdc-list-group>
      <mdc-list two-line>
        <mdc-list-item v-for="member of members" :key="member.id">
          <img slot="avatar" :src="member.profile.picture"/>
          {{ member.profile.name }}
          <span slot="secondary-text">
            {{ member.profile.email }}
          </span>
        </mdc-list-item>
      </mdc-list>
      <mdc-list actionable multiline>
        <mdc-list-item separator />
        <mdc-list-item ripple @click="$refs.link.copy()">
          <span slot="start-detail" class="material-icons">
            group_add
          </span>
          Invite team members
          <span slot="secondary-text">
            <copy-text :value="link" ref="link" />
          </span>
        </mdc-list-item>
      </mdc-list>
    </mdc-list-group>
    <layout-container padding="less">
      <type-container>
        <type-text tag="p" type="body1">
          Send the link above to your teammates. Be careful who you send it to, anyone with the link can join.
        </type-text>
      </type-container>
    </layout-container>
  </div>
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
import CopyText from '@/components/CopyText';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';

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
    CopyText,
  },
  computed: {
    members() {
      const session = this.$store.getters[CURRENT_PLANNER_SESSION];
      return (session && session.users) || [];
    },
    link() {
      return (
        location.origin +
        (this.$router.mode === 'hash' ? '/#' : '') +
        this.$route.fullPath
      );
    },
  },
};
</script>
