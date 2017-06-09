<template>
  <div class="mdc-menu-anchor">
    <button class="material-icons menu-button" @click="menu.open = !menu.open">more_vert</button>
    <div class="mdc-simple-menu" tabindex="-1" ref="menu">
      <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
        <router-link :to="dashboard.path">
          <li
            v-if="$route.name !== dashboard.name"
            class="mdc-list-item"
            role="menuitem"
            tabindex="0"
          >
            Return to dashboard
          </li>
        </router-link>
        <li
          v-if="isSignedIn"
          class="mdc-list-item"
          role="menuitem"
          tabindex="0"
          @click="signOut()"
        >
          Sign out
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MDCSimpleMenu } from '@material/menu';
import { mapState } from 'vuex';
import dashboard from '@/router/dashboard';

export default {
  mounted() {
    this.menu = new MDCSimpleMenu(this.$refs.menu);
  },
  data() {
    return {
      menu: null,
      dashboard,
    };
  },
  computed: {
    ...mapState({
      isSignedIn: state => state.auth.isSignedIn,
    }),
  },
  methods: {
    async signOut() {
      await this.$store.dispatch('signOut');
      this.$router.push('/');
    },
  },
  beforeDestroy() {
    this.menu.destroy();
  },
};
</script>

<style scoped lang="scss">
@import '@material/menu/mdc-menu';

.mdc-simple-menu .mdc-list-item {
  font-size: 1.4rem;
  font-family: inherit;
}

.mdc-list {
  font-family: inherit;
}

.menu-button {
  background: none;
  border: none;
  transform: translateY(0.3rem);
  padding: 0;

  &:focus {
    outline: none;
  }
}
</style>
