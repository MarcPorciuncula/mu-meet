<template>
  <div>
    <guide v-if="!session.result.status"
      @change-tab="$emit('change-tab', $event)"
      @request-result="result()"
    />
    <meetings-loading v-else-if="session.result.status !== 'DONE'" />
    <meetings v-else />
</div>
</template>

<script>
import Guide from './Guide';
import MeetingsLoading from './MeetingsLoading';
import Meetings from './Meetings';
import { REQUEST_PLANNER_RESULT } from '@/store/actions';

export default {
  components: {
    Guide,
    MeetingsLoading,
    Meetings,
  },
  props: {
    session: {},
  },
  methods: {
    result() {
      this.$store.dispatch(REQUEST_PLANNER_RESULT);
    },
  },
};
</script>
