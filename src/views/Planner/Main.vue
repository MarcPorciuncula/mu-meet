<template>
  <div>
    <Guide v-if="!session.result.status"
      @change-tab="$emit('change-tab', $event)"
      @request-result="result()"
    />
    <MeetingsLoading
      v-else-if="session.result.status !== 'DONE'"
      @change-tab="$emit('change-tab', $event)"
    />
    <Meetings
      v-else
      @change-tab="$emit('change-tab', $event)"
    />
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
