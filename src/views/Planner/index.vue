<template>
  <div>
    <HeaderBar class="header-bar bg-black-o90 white" style="margin-bottom: 52px">
      <ProfilePictureForCurrentUser class="f5" style="width: 1.8rem; height: 1.8rem" />
    </HeaderBar>
    <SlideOut
      :open="open"
      @open="open = true"
      @change-tab="tab = TABS[$event]"
    >
      <div class="mdc-theme--dark slide-out_inner pb3">
        <div class="flex justify-between items-center ph3">
          <h2 class="f4 lh-title fw4 mv0">
            {{ tab.title }}
          </h2>
          <button
            @click="open = false"
            class="flex items-center justify-around bg-transparent lh-copy sans pa0 bn white w2 h2"
          >
            <span class="material-icons f4">
              close
            </span>
          </button>
        </div>
        <Parameters
          v-if="tab.id === TABS.SETTINGS.id"
          :session="session"
        />
        <Team
          v-if="tab.id === TABS.USERS.id"
          :session="session"
        />
      </div>
    </SlideOut>
    <div>
      <MainTab :session="session" @change-tab="(tab = TABS[$event], open = true)" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderBar from '@/views/HeaderBar';
import ProfilePictureForCurrentUser from '@/views/ProfilePicture/ForCurrentUser';
import Toolbar from './Toolbar';
import SlideOut from './SlideOut';
import Main from './Main';
import Team from './Team';
import Parameters from './Parameters';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';
import { RESET_PLANNER } from '@/store/actions';

const SETTINGS = { id: 'SETTINGS', title: 'Settings' };
const USERS = { id: 'USERS', title: 'Team' };
const TABS = { SETTINGS, USERS };

export default {
  name: 'Planner',
  components: {
    MainTab: Main,
    Team,
    Parameters,
    HeaderBar,
    ProfilePictureForCurrentUser,
    Toolbar,
    SlideOut,
  },
  data() {
    return {
      open: false,
      tab: { id: 'SETTINGS', title: 'Settings' },
    };
  },
  computed: {
    ...mapGetters({
      session: CURRENT_PLANNER_SESSION,
    }),
    TABS: () => TABS,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch(RESET_PLANNER);
    next();
  },
};
</script>

<style scoped lang="scss">
.bg-black-o90 {
  background-color: rgba(darken(#263238, 10%), 0.9);
}

.slide-out__inner {
  overscroll-behaviour: contain;
  overflow-y: auto;
  max-height: 100%;
}
</style>
