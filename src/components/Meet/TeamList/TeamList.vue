<template>
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
        <mdc-list-item v-for="member of members" :key="member.id">
          <img slot="avatar" :src="member.profile.picture"/>
          {{ member.profile.name }}
          <span slot="secondary-text">
            {{ member.profile.email }}
          </span>
        </mdc-list-item>
      </mdc-list>
    </layout-container>
  </layout-section>
</template>

<script>
import VueTypes from 'vue-types';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
} from '@/components/Material/List';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    MdcList,
    MdcListItem,
  },
  props: {
    members: VueTypes.arrayOf(
      VueTypes.shape({
        profile: VueTypes.shape({
          name: VueTypes.string.isRequired,
          email: VueTypes.string.isRequired,
          picture: VueTypes.string.isRequired,
        }).loose,
        id: VueTypes.string.isRequired,
      }).loose,
    ),
  },
};
</script>
