<template>
  <div class="wrapper">
    <header-bar title="helo">
      <div slot="controls">
        <transition name="drop-in">
          <router-link :to="links.signin" v-show="showHeaderGetStarted" style="display: block">
            <mdc-button raised class="get-started">
              Find a time
            </mdc-button>
          </router-link>
        </transition>
      </div>
    </header-bar>
    <layout-section class="section-splash">
      <layout-container class="section-vertical-align" ref="splash">
        <div>
          <type-text tag="h1" type="display1">
            MUmeet finds meeting times based on your team's calendars.
          </type-text>
          <router-link :to="links.signin">
            <mdc-button hero raised class="get-started">Find a time</mdc-button>
          </router-link>
        </div>
      </layout-container>
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
        Sync your uni timetable with one click
      </span>
      <span slot="body">
        MUmeet was developed especially for university assignment groups. Sign in to your student account and we'll automatically find and sync your timetable to Google Calendar. (Coming soon)
      </span>
    </landing-section>
    <layout-section class="section-get-started">
      <layout-container padding="normal">
        <type-container>
          <type-text tag="h2" type="display1">
            Round up your team and find a better meeting time, it's easy with MUmeet.
          </type-text>
        </type-container>
        <div style="text-align: center" ref="getStarted">
          <router-link :to="links.signin">
            <mdc-button hero raised class="get-started">
              Find a time
            </mdc-button>
          </router-link>
        </div>
      </layout-container>
    </layout-section>
    <page-footer></page-footer>
  </div>
</template>

<script>
import './Material/typography.scss';
import MdcButton from './Material/Button';
import { TypeText, TypeContainer } from './Material/Typography';
import LayoutContainer from './Layout/Container';
import HeaderBar from './HeaderBar';
import PageFooter from './Footer';
import LayoutSection from './Layout/Section';
import signin from '@/router/signin';

const THRESHOLD = 0.1;

const LandingSection = {
  components: {
    LayoutContainer,
    TypeText,
    TypeContainer,
    LayoutSection,
  },
  template: `
    <layout-section tag="section">
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
    PageFooter,
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
    this.observer.observe(this.$refs.splash.$el);
    this.observer.observe(this.$refs.getStarted);
  },
  methods: {
    handleSplashIntersectionUpdate(entries, observer) {
      this.showHeaderGetStarted =
        Math.max(...entries.map(x => x.intersectionRatio)) < THRESHOLD;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';
@import '@material/elevation/mixins';

.wrapper {
  position: relative;
}

.section-splash {
  min-height: calc(100vh - 3.475rem);
  height: 0;
  background: #ECEFF1;

  .get-started {
    margin-top: 2rem;
  }
}

.section-get-started {
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.section-graphic {
  background: #ECEFF1;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-vertical-align {
  display: flex;
  align-items: center;
  height: 100%;
}

.get-started {
  background-color: #2196F3;
  color: white;
}

.drop-in {
  &-enter-active, &-leave-active {
    will-change: transform, opacity;
  }

  &-enter-active {
    $duration: 400ms;
    $delay: 200ms;
    transition: mdc-animation-enter(opacity, $duration, $delay), mdc-animation-enter(transform, $duration, $delay);
  }

  &-leave-active {
    $duration: 250ms;
    transition: mdc-animation-exit(opacity, $duration), mdc-animation-exit(transform, $duration);
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
