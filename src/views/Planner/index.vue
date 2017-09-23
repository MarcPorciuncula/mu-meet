<template>
  <scroll-snap ref="snap" :offset="56" :threshold="56">
    <tab-container
      :tabs="[{ id: 'meetings' }, { id: 'team' }, { id: 'configure' }]"
      :active="active"
      style="height: calc(100vh - 112px)"
    >
      <div slot="meetings">
        <main-tab :session="session" @change-tab="change($event)" />
      </div>
      <div slot="team">
        <team :session="session" />
      </div>
      <div slot="configure">
        <parameters :session="session" />
      </div>
    </tab-container>
    <hero-tab-bar
      :tabs="[{ icon: 'event', id: 'meetings' }, { icon: 'people', id: 'team' }, { icon: 'tune', id: 'configure' }]"
      :active="active"
      @change="change($event)"
    />
  </scroll-snap>
</template>

<script>
import { mapGetters } from 'vuex';
import HeroTabBar from '@/components/Tabs/HeroTabBar';
import ScrollSnap from '@/components/ScrollSnap';
import TabContainer from '@/components/Tabs/TabContainer';
import Main from './Main';
import Team from './Team';
import Parameters from './Parameters';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { RESET_PLANNER } from '@/store/actions';

export default {
  name: 'Planner',
  components: {
    HeroTabBar,
    TabContainer,
    MainTab: Main,
    ScrollSnap,
    Team,
    Parameters,
  },
  data() {
    return {
      active: 'meetings',
    };
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
  },
  mounted() {
    setTimeout(this.$refs.snap.center, 250);
  },
  methods: {
    change(id) {
      this.active = id;
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch(RESET_PLANNER);
    next();
  },
};
</script>

<style scoped lang="scss">

</style>
