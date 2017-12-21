<template>
  <div
    @touchstart="adjustTabsShift()"
    @touchend="adjustTabsShift()"
    @touchmove="adjustTabsShift()"
  >
    <HeaderBar class="bg-white">
      <ProfilePictureForCurrentUser class="f5" style="width: 1.8rem; height: 1.8rem" />
    </HeaderBar>
    <ScrollSnap ref="snap" :offset="64" :threshold="96">
      <TabContainer
        :tabs="[{ id: 'meetings' }, { id: 'team' }, { id: 'parameters' }]"
        :active="active"
        :style="`height: calc(100vh - 64px - 57px); padding-bottom: ${tabsShift * -1}px`"
      >
        <div slot="meetings">
          <MainTab :session="session" @change-tab="change($event)" />
        </div>
        <div slot="team">
          <Team :session="session" />
        </div>
        <div slot="parameters">
          <Parameters :session="session" />
        </div>
      </TabContainer>
      <HeroTabBar
        ref="tabs"
        :tabs="[{ icon: 'event', id: 'meetings' }, { icon: 'people', id: 'team' }, { icon: 'tune', id: 'parameters' }]"
        :active="active"
        :style="{
          transform: `translateY(${tabsShift}px)`,
          transition: 'transform 100ms ease',
        }"
        @change="change($event)"
      />
    </ScrollSnap>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import HeroTabBar from '@/components/Tabs/HeroTabBar';
import ScrollSnap from '@/components/ScrollSnap';
import TabContainer from '@/components/Tabs/TabContainer';
import HeaderBar from '@/views/HeaderBar';
import ProfilePictureForCurrentUser from '@/views/ProfilePicture/ForCurrentUser';
import Main from './Main';
import Team from './Team';
import Parameters from './Parameters';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { RESET_PLANNER } from '@/store/actions';
import debounce from 'lodash/debounce';

export default {
  name: 'Planner',
  components: {
    HeroTabBar,
    TabContainer,
    MainTab: Main,
    ScrollSnap,
    Team,
    Parameters,
    HeaderBar,
    ProfilePictureForCurrentUser,
  },
  data() {
    return {
      active: 'meetings',
      tabsShift: 0,
    };
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
  },
  mounted() {
    setTimeout(this.$refs.snap.center, 250);

    this.adjustTabsShift = debounce(this.adjustTabsShift, 150);
    this.adjustTabsShift();
  },
  methods: {
    change(id) {
      this.active = id;
    },
    adjustTabsShift() {
      Vue.nextTick(() => {
        window.requestAnimationFrame(() => {
          const rect = this.$refs.tabs.$el.getBoundingClientRect();
          this.tabsShift = Math.min(
            this.tabsShift + window.innerHeight - rect.bottom,
            0,
          );
          console.log('adjust');
        });
      });
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
