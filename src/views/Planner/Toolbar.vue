<template>
  <div class="pt1 pb3 ph3 flex justify-between">
    <div class="flex">
      <ProfilePicture
        v-for="user of session.users"
        :key="user.uid"
        :user="{ profile: user }"
        class="w2 h2 mr2"
      />
      <button
        v-if="session.users.length < 2"
        @click="$emit('open', $emit('change-tab', 'USERS'))"
        class="flex items-center justify-around br-100 bg-grey-900 lh-copy sans pa0 bn white w2 h2 mr2"
      >
        <span class="material-icons f4">
          group_add
        </span>
      </button>
    </div>
    <div class="flex">
      <button
        @click="($emit('open'), $emit('change-tab', 'USERS'))"
        class="flex items-center justify-around br-100 bg-grey-900 lh-copy sans pa0 bn white w2 h2 mr2"
      >
        <span class="material-icons f4">
          group
        </span>
      </button>
      <button
        @click="($emit('open'), $emit('change-tab', 'SETTINGS'))"
        class="flex items-center justify-around br-100 bg-grey-900 lh-copy sans pa0 bn white w2 h2"
      >
        <span class="material-icons f4">
          settings
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProfilePicture from '@/views/ProfilePicture';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';

export default {
  name: 'PlannerToolbar',
  components: {
    ProfilePicture,
  },
  computed: mapGetters({
    session: CURRENT_PLANNER_SESSION,
  }),
};
</script>

<style scoped lang="scss">

</style>
