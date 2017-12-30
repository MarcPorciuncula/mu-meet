<template>
  <div class="flex flex-column items-center">
    <div class="flex flex-column items-center pv3">
      <p
        class="f6 lh-title"
        v-for="message, key in ({ FETCH_SCHEDULES: 'Getting schedules', RESOLVE_TIMES: 'Resolving conflicts' })"
        :key="key"
        v-if="status === key"
      >
        {{ message }}...
      </p>
      <MdcLinearProgress
        indeterminate
        loading
        class="progress__progress-bar"
      />
    </div>
  </div>
</template>

<script>
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcLinearProgress from '@/components/Material/LinearProgress';
import { mapGetters } from 'vuex';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    MdcLinearProgress,
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
    status() {
      return this.session.result.status;
    },
  },
};
</script>

<style scoped lang="scss">
.meetings-loading {
  min-height: calc(100vh - (56px * 2));
  display: flex;
  flex-direction: column;
}

.progress {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 56px;
}

.progress__progress-bar {
  width: 140px;
}
</style>
