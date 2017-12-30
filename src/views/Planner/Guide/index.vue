<template>
  <div class="flex flex-column items-center">
    <div class="mw6 w-100 pa3">
      <div class="bg-white br2 br--bottom elevate1 mb3 pv1">
        <MdcListGroup>
          <MdcList>
            <router-link :to="{ name: 'calendars', query: { callback: $route.path } }">
              <MdcListItem class="pointer">
                <span slot="graphic">
                  1.
                </span>
                <span>
                  Manage calendars
                </span>
                <span class="material-icons" slot="meta">
                  event_note
                </span>
              </MdcListItem>
            </router-link>
            <MdcListItem class="pointer" @click="$emit('change-tab', 'USERS')">
              <span slot="graphic">
                2.
              </span>
              <span>
                Invite team members
              </span>
              <span class="material-icons" slot="meta">
                group_add
              </span>
            </MdcListItem>
            <MdcListItem class="pointer" @click="$emit('change-tab', 'SETTINGS')">
              <span slot="graphic">
                3.
              </span>
              <span>
                Change parameters
              </span>
              <span class="material-icons" slot="meta">
                tune
              </span>
            </MdcListItem>
            <MdcListDivider />
            <MdcListItem class="pointer" @click="$emit('request-result')">
              <span slot="graphic">
                4.
              </span>
              <span>
                Find meeting times
              </span>
              <span class="material-icons" slot="meta">
                event
              </span>
            </MdcListItem>
          </MdcList>
        </MdcListGroup>
      </div>
    </div>
  </div>
</template>

<script>
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/List/Item';
import MdcListGroup from '@/components/Material/List/Group';
import MdcListDivider from '@/components/Material/List/Divider';
import MdcButton from '@/components/Material/Button';

export default {
  components: {
    MdcListGroup,
    MdcList,
    MdcListItem,
    MdcListDivider,
    MdcButton,
  },
};
</script>

<style scoped lang="scss">
.mdc-list /deep/ .mdc-list-item__start-detail {
  margin-right: 16px;
}
</style>
