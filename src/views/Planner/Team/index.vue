<template>
  <div>
    <div class="flex flex-column items-center">
      <div class="mw6 w-100">
        <MdcListGroup>
          <MdcList two-line avatar-list>
            <MdcListItem
              v-for="member of members"
              :key="member.id"
            >
              <ProfilePicture slot="graphic" :user="{ profile: member }" />
              {{ member.name }}
              <span slot="secondary">
                {{ member.email }}
              </span>
            </MdcListItem>
          </MdcList>
          <MdcListDivider tag="hr" />
          <MdcList two-line avatar-list>
            <MdcListItem
              class="pointer"
              @click="$refs.link.copy()"
            >
              <span slot="graphic" class="material-icons">
                group_add
              </span>
              Invite team members
              <span slot="secondary">
                <CopyText :value="link" ref="link" />
              </span>
            </MdcListItem>
          </MdcList>
        </MdcListGroup>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/views/ProfilePicture';
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/List/Item';
import MdcListGroup from '@/components/Material/List/Group';
import MdcListDivider from '@/components/Material/List/Divider';
import CopyText from '@/components/CopyText';

export default {
  components: {
    ProfilePicture,
    MdcListGroup,
    MdcList,
    MdcListItem,
    MdcListDivider,
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
.mdc-list /deep/ .mdc-list-item__start-detail {
  margin-right: 16px;
}
</style>
