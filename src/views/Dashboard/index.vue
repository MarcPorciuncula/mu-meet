<template>
  <div style="flex-grow: 1">
    <div class="flex flex-column items-center bg-white">
      <HeaderBar>
        <div class="flex items-center">
          <div class="mr2">
            <span class="f5">
              {{ profile.given_name }}
            </span>
          </div>
          <ProfilePictureForCurrentUser class="f5" style="width: 1.8rem; height: 1.8rem" />
        </div>
      </HeaderBar>
      <div class="mw8 w-100 mt4-ns mb3 pa3 pb6">
        <h2 class="f3 fw5 lh-title mt0">Welcome to MUmeet!</h2>
        <p class="f5 lh-copy grey-600 measure-narrow">
          Find meeting times fast, so you can focus on the real work.
        </p>
        <div class="mv2 grey-800">
          <router-link
            :to="{ name: 'calendars', query: { callback: '/my/dashboard' } }"
            class="f5 lh-copy"
          >
            <span class="f4 material-icons" style="transform: translate(-5%, 25%)">
              event_note
            </span>
            <span class="bb">
              Manage calendars
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex flex-column items-center mtn6 mb4">
      <div class="mw8 w-100 ph3">
        <h3 class="f6 fw5 grey-600 lh-title">
          Recent plans
        </h3>
        <div class="flex flex-wrap">
          <div class="meeting-card-outer">
            <div class="pa3 bg-white bg-grey-100-hover br2 br--bottom pointer elevate1 elevate6-hover elevate-transition flex flex-column items-center justify-center meeting-card relative pt4 grey-800">
              <span class="f1 db mvn2 material-icons">event</span><br/>
              <span class="f5 lh-title b">
                Start meeting plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderBar from '@/views/HeaderBar';
import ProfilePictureForCurrentUser from '@/views/ProfilePicture/ForCurrentUser';
import { USER_PROFILE } from '@/store/getters';

export default {
  name: 'Dashboard',
  components: {
    HeaderBar,
    ProfilePictureForCurrentUser,
  },
  computed: mapGetters({
    profile: USER_PROFILE,
  }),
};
</script>

<style scoped lang="scss">
@import 'tachyons-sass/scss/media-queries';

.meeting-card-outer {
  width: 100%;
}

@media #{$breakpoint-medium} {
  .meeting-card-outer {
    width: 50%;
  }
}

@media #{$breakpoint-large} {
  .meeting-card-outer {
    width: 33%;
  }
}

.meeting-card {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 0.25rem;
    background: linear-gradient(to right, #e0e0e0, #eeeeee);
  }

  height: 14rem;
}
</style>
