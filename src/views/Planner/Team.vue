<template>
  <layout-section padding="less">
    <layout-container padding="normal">
      <type-container trim-bottom>
        <type-text tag="h3" type="title">
          Team
        </type-text>
      </type-container>
    </layout-container>
    <layout-container padding="min">
      <mdc-list-group>
        <mdc-list
          two-line
          class="team-members"
        >
          <mdc-list-item
            v-for="member of members"
            :key="member.id"
          >
            <img slot="avatar" :src="member.picture"/>
            {{ member.name }}
            <span slot="secondary-text">
              {{ member.email }}
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
    </layout-container>
    <layout-container padding="normal">
      <type-container>
        <type-text tag="p" type="body1">
          Send the link above to your teammates. Be careful who you send it to, anyone with the link can join.
        </type-text>
      </type-container>
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
import CopyText from '@/components/CopyText';

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
  props: {
    session: {},
  },
  computed: {
    members() {
      return this.session.users;
    },
    link() {
      return location.origin + '/plan/' + this.session.id;
    },
  },
};
</script>

<style scoped lang="scss">
.team-members .mdc-list-item {
  overflow: visible;
}
</style>
