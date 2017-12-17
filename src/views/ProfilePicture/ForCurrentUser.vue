<template>
  <div class="mdc-menu-anchor pointer" @click="$refs.menu.show()">
    <ProfilePicture
      :user="{ profile: profile || { photo: PLACEHOLDER_PHOTO, name: '' }}"
    />
    <MdcMenu ref="menu" class="mdc-simple-menu--open-from-top-right">
      <router-link :to="{ name: 'signout' }">
        <MdcMenuItem>
          Sign out
        </MdcMenuItem>
      </router-link>
    </MdcMenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProfilePicture from '.';
import MdcMenu from '@/components/Material/Menu';
import MdcMenuItem from '@/components/Material/MenuItem';
import { USER_PROFILE, IS_SIGNED_IN } from '@/store/getters';
import { FETCH_USER_PROFILE } from '@/store/actions';

const PLACEHOLDER_PHOTO =
  'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

export default {
  name: 'ProfilePictureForCurrentUser',
  components: {
    ProfilePicture,
    MdcMenu,
    MdcMenuItem,
  },
  computed: {
    ...mapGetters({
      isSignedIn: IS_SIGNED_IN,
      profile: USER_PROFILE,
    }),
    PLACEHOLDER_PHOTO: () => PLACEHOLDER_PHOTO,
  },
  created() {
    if (this.isSignedIn && !this.profile) {
      this.$store.dispatch(FETCH_USER_PROFILE);
    }
  },
};
</script>
