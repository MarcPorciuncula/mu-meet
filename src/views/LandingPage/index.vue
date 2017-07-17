<template>
  <div class="wrapper">
    <layout-section class="section-splash">
      <div class="call-to-action" ref="splash">
        <type-text tag="h1" type="display1">
          MUmeet finds meeting times based on your team's calendars.
        </type-text>
        <router-link :to="links.signin" class="call-to-action_action">
          <mdc-button hero raised class="get-started">Find a time</mdc-button>
        </router-link>
      </div>
      <div class="section-splash_credit">
        <type-text tag="a" type="body2" href="https://unsplash.com/photos/FoKO4DpXamQ">
          Photo by Eric Rothermel on Unsplash
        </type-text>
      </div>
    </layout-section>

    <landing-section>
      <span slot="headline">
        Find meeting times that suit you and your team's calendars.
      </span>
      <span slot="body">
        Whatever your schedule, MUmeet finds a meeting time for all of your team so you can spend your time collaborating, not scheduling.
      </span>
    </landing-section>
    <section class="section-graphic">

    </section>
    <landing-section>
      <span slot="headline">
        Powered by Google Calendar
      </span>
      <span slot="body">
        MUmeet uses your existing Google Calendar events, so you don't need to spend time entering your schedule. Once MUmeet has found a meeting time, you can even save it directly to your Google Calendar.
      </span>
    </landing-section>
    <div class="section-graphic">

    </div>
    <landing-section>
      <span slot="headline">
        Sync your uni timetable in just a few clicks
      </span>
      <span slot="body">
        MUmeet was developed especially for university assignment groups. Sign in to your student account and we'll help you find and sync your timetable to Google Calendar. (Coming soon)
      </span>
    </landing-section>
    <layout-section class="section-get-started" padding="more">
      <div class="call-to-action">
        <type-container>
          <type-text tag="h2" type="display1">
            Round up your team and find a better meeting time, it's easy with MUmeet.
          </type-text>
        </type-container>
        <div style="text-align: center" ref="getStarted">
          <router-link :to="links.signin" class="call-to-action_action">
            <mdc-button hero raised class="get-started">
              Find a time
            </mdc-button>
          </router-link>
        </div>
      </div>
    </layout-section>
  </div>
</template>

<script>
import '@/components/Material/typography.scss';
import MdcButton from '@/components/Material/Button';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import LayoutContainer from '@/components/Layout/Container';
import HeaderBar from '@/components/HeaderBar';
import LayoutSection from '@/components/Layout/Section';
import signin from '@/router/auth/signin';
import data from './data';

const THRESHOLD = 0.1;

const LandingSection = {
  components: {
    LayoutContainer,
    TypeText,
    TypeContainer,
    LayoutSection,
  },
  template: `
    <layout-section tag="section" padding="more">
      <layout-container padding="more">
        <type-container>
          <type-text tag="h2" type="headline">
            <slot name="headline"></slot>
          </type-text>
          <type-text tag="p" type="body1">
            <slot name="body"></slot>
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
  `,
};

export default {
  components: {
    MdcButton,
    TypeText,
    TypeContainer,
    LandingSection,
    LayoutContainer,
    HeaderBar,
    // PageFooter,
    LayoutSection,
  },
  data() {
    return {
      showHeaderGetStarted: false,
      links: { signin: signin.path },
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(
      this.handleSplashIntersectionUpdate.bind(this),
      {
        threshold: THRESHOLD,
      },
    );
    this.observer.observe(this.$refs.splash);
    this.observer.observe(this.$refs.getStarted);
  },
  methods: {
    handleSplashIntersectionUpdate(entries, observer) {
      data.showHeaderGetStarted =
        Math.max(...entries.map(x => x.intersectionRatio)) < THRESHOLD;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';
@import '@material/elevation/mixins';

// .wrapper {
//   position: relative;
// }

.call-to-action {
  max-width: 34rem;
  padding: 1.5rem
}

.call-to-action_action {
  display: block;
  margin: 2rem auto;
}

.section-splash {
  min-height: calc(100vh - 3.475rem);
  height: 0;
  background: #ECEFF1;
  justify-content: center;
  background-image: url('../../assets/eric-rothermel-23788-1080.jpg');
  background-size: cover;
  position: relative;

  &_credit {
    position: absolute;
    bottom: 0.5rem;
    .type {
      color: rgba(#FFF, 0.2);
    }
  }
}

@media (min-width: 28rem) {
  .call-to-action_action {
    width: 10rem;
  }
}

@media (min-width: 46rem) {
  .section-splash {
    min-height: 100vh;
  }
}

.section-graphic {
  background: #ECEFF1;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.get-started {
  background-color: #2196F3;
  color: white;
}
</style>
