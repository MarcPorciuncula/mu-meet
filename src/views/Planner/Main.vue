<template>
  <div>
    <guide v-if="!session.result.status"
      @change-tab="$emit('change-tab', $event)"
      @request-result="result()"
    />
    <meetings v-else />
</div>
</template>

<script>
import Guide from './Guide';
import Meetings from './Meetings';
import { REQUEST_PLANNER_RESULT } from '@/store/actions';

export default {
  components: {
    Guide,
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
