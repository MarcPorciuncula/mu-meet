<template>
  <div class="wrapper-meet">
    <section>
      <h2 class="section_headline">
        Meeting Planner
      </h2>
    </section>
    <section>
      <ul class="mdc-list mdc-list--two-line">
        <li class="mdc-list-item" ref="invite" v-mdc-ripple>
          <span class="mdc-list-item__start-detail material-icons material-icons--adjust-left">
            group_add
          </span>
          <span class="mdc-list-item__text">
            Invite your team
            <span class="mdc-list-item__text__secondary">
              {{ displayLink }}
            </span>
          </span>
        </li>
        <li class="mdc-list-item" v-mdc-ripple>
          <span class="mdc-list-item__start-detail material-icons">
            tune
          </span>
          <span class="mdc-list-item__text">
            Set meeting parameters (Coming soon)
            <span class="mdc-list-item__text__secondary">
              At least 1 hour from 9am to 5pm on weekdays, this week.
            </span>
          </span>
        </li>
        <router-link :to="`/calendars?callback=${$route.path}`">
          <li class="mdc-list-item" v-mdc-ripple>
            <span class="mdc-list-item__start-detail material-icons">
              event_note
            </span>
            <span class="mdc-list-item__text">
              Select your calendars
              <span class="mdc-list-item__text__secondary">
                {{ calendars.length }}
                calendar{{ calendars.length === 1 ? '' : 's' }}
                selected
              </span>
            </span>
          </li>
        </router-link>
        <li class="mdc-list-divider" role="separator"></li>
        <li class="mdc-list-item" v-mdc-ripple>
          <span class="mdc-list-item__start-detail material-icons">
            event
          </span>
          <span class="mdc-list-item__text">
            Find a time
            <span class="mdc-list-item__text__secondary">
              12 possible meeting times
            </span>
          </span>
        </li>
      </ul>
    </section>
    <section>
      <h3 class="section_heading">
        Team
      </h3>
      <ul class="user-list mdc-list mdc-list--avatar-list mdc-list--two-line mdc-list--dense">
        <li v-for="user of users" class="mdc-list-item">
          <img
            class="mdc-list-item__start-detail profile-picture"
            :src="user.profile.picture"
            width="56"
            height="56"
          />
          <span class="mdc-list-item__text">
            {{ user.profile.name}}
            <span class="mdc-list-item__text__secondary">
              {{ user.profile.email }}
            </span>
          </span>
          <span class="mdc-list-item__end-detail material-icons">
            {{ user.isHost ? 'supervisor_account' : 'more_vert' }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Clipboard from 'clipboard/dist/clipboard';
import MdcRipple from '@/directives/mdc-ripple';

export default {
  directives: {
    MdcRipple,
  },
  mounted() {
    this.clipboard = new Clipboard(this.$refs.invite, {
      text: () => this.inviteLink,
    });
    this.clipboard.on('success', () => {
      // FIXME notify the user
      console.log('Copied to clipboard');
    });
  },
  computed: mapState({
    hostUid: state => state.meet.session.host,
    userUids: state => Object.keys(state.meet.session.users),
    users(state) {
      return this.userUids.map(uid =>
        Object.assign({ profile: {} }, state.users.users[uid], {
          isHost: uid === this.hostUid,
        }),
      );
    },
    inviteLink: state => location.href,
    displayLink: state => location.href.match(/https?:\/\/(.+)/)[1],
    calendars: state =>
      Object.values(state.calendars).filter(calendar => calendar.selected),
  }),
  beforeDestroy() {
    this.clipboard.destroy();
  },
};
</script>

<style scoped lang="scss">
@import '@material/list/mdc-list';
@import '@material/elevation/mixins';

.wrapper-meet {
  min-height: calc(100vh - 5.8rem);
  background-color: #FAFAFA;
  padding: 0.5rem 0;
}

section {
  padding: 1rem 2rem;
  min-height: 100%;
}

.section_headline {
  margin-top: 0;
  font-size: 3.6rem;
}

.section_heading:first-child {
  margin-top: 0;
}

.section_headline:last-child {
  margin-bottom: 0;
}

.section_heading {
  font-size: 1.8rem;
  margin-bottom: 0;
}


.mdc-list {
  font-size: 1.6rem;
  font-family: inherit;
  line-height: 1.6em;
  letter-spacing: 0.02em;
  margin-left: -1rem;
  margin-right: -1rem;
}

.mdc-list-item__text .mdc-list-item__text__secondary {
  font-family: inherit;
  font-size: 1.4rem;
  line-height: 1.6rem;
}

.mdc-list  .mdc-list-item__start-detail {
  margin-right: 24px;
}

.material-icons {
  color: #616161
}

.material-icons--adjust-left {
  transform: translateX(-2px);
}
</style>
