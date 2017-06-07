<template>
  <div class="wrapper-meet">
    <section>
      <h2 class="section_headline">
        Meeting Planner
      </h2>
    </section>
    <section class="section-meeting-suggestion">
      Find a meeting time by inviting your team to this planning session.
    </section>
    <section>
      <ul class="mdc-list mdc-list--dense mdc-list--two-line">
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Invite your team
            <span class="mdc-list-item__text__secondary">
              mumeet.surge.sh/#/meet/B7h1kC
            </span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Set meeting parameters
            <span class="mdc-list-item__text__secondary">
              1 hour from 9am to 5pm on weekdays, this week.
            </span>
          </span>
        </li>
      </ul>
    </section>
    <!-- <section>
      <h3 class="section_heading">Settings</h3>
      <ul class="mdc-list mdc-list--two-line mdc-list--dense">
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Minimum duration
            <span class="mdc-list-item__text__secondary">
              1 hour
            </span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Days
            <span class="mdc-list-item__text__secondary">
              Weekdays
            </span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Hours
            <span class="mdc-list-item__text__secondary">
              9am - 5pm
            </span>
          </span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">
            Search dates
            <span class="mdc-list-item__text__secondary">
              This week
            </span>
          </span>
        </li>
      </ul>
    </section> -->
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
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState({
    users: () => [
      {
        profile: {
          name: 'Marc Porciuncula',
          email: 'mpor14@student.monash.edu',
          picture:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        },
        isHost: true,
      },
    ],
  }),
};
</script>

<style scoped lang="scss">
@import '@material/list/mdc-list';
@import '@material/elevation/mixins';
@import '@material/ripple/mixins';

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

.section_headline:last-child {
  margin-bottom: 0;
}

.section_heading {
  font-size: 1.8rem;
  margin-bottom: 0;
}

.section_heading:first-child {
  margin-top: 0;
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
}
</style>
