<template>
  <div class="meetings-loading">
    <layout-section padding="less">
      <layout-container>
        <type-container trim-bottom>
          <type-text tag="h3" type="title">
            Meeting Times
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <layout-section class="progress">
      <type-container>
        <type-text
          tag="p"
          type="body2"
          v-for="message, key in ({ FETCH_SCHEDULES: 'Getting schedules', RESOLVE_TIMES: 'Resolving conflicts' })"
          :key="key"
          v-if="status === key"
        >
          {{ message }}...
        </type-text>
      </type-container>
      <mdc-linear-progress
        indeterminate
        loading
        class="progress__progress-bar"
      />
    </layout-section>
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
