<template>
  <div class="wrapper">
    <header class="header">
      <div style="flex-grow: 1">
        <mumeet-logo class="header_logo"></mumeet-logo>
      </div>
      <transition name="drop-in">
        <router-link to="/login" v-show="showHeaderGetStarted">
          <mdc-button class="get-started">
            Find a time
          </mdc-button>
        </router-link>
      </transition>
    </header>
    <section class="section--splash" ref="splash">
      <div class="section_centered section_vertical-align">
        <div>
          <h1 class="section_headline">
            A quick and easy meeting scheduler
          </h1>
          <router-link to="/login">
            <mdc-button class="get-started">Find a time</mdc-button>
          </router-link>
        </div>
      </div>
    </section>
    <section>
      <div class="copy">
        <h2 class="section_headline">
          Find meeting times that suit you and your team's calendars.
        </h2>
        <p>
          Whatever your schedule, MUmeet finds a meeting time for all of your team so you can spend your time collaborating, not scheduling.
        </p>
      </div>
    </section>
    <section class="section--graphic">

    </section>
    <section>
      <div class="copy">
        <h2 class="section_headline">
          Powered by Google Calendar
        </h2>
        <p>
          MUmeet uses your existing Google Calendar events, so you don't need to spend time entering your schedule. Once MUmeet has found a meeting time, you can even save it directly to your Google Calendar.
        </p>
      </div>
    </section>
    <div class="section--graphic">

    </div>
    <section>
      <div class="copy">
        <h2 class="section_headline">
          Sync your uni timetable with one click
        </h2>
        <p>
          MUmeet was developed especially for university assignment groups. Sign in to your student account and we'll automatically find and sync your timetable to Google Calendar. (Coming soon)
        </p>
      </div>
    </section>
    <div class="section-graphic">

    </div>
    <section class="section--get-started" ref="getStarted">
      <div class="section_centered">
        <div>
          <h2 class="section_headline">
            What are you waiting for?
          </h2>
          <p>Find a meeting time with your team</p>
          <router-link to="/login">
            <mdc-button class="get-started">
              Find a time
            </mdc-button>
          </router-link>
        </div>
      </div>
    </section>
    <div class="footer">
      <p>
        Design and development by<br/> <a class="author-link" href="https://github.com/MarcoThePoro">Marc Porciuncula</a> and <a class="author-link">Kalana Vithana</a><br/>
        Second runner up in <b>Unihack Mini 2017</b><br/>
        Made with &lt;3 in Melbourne Australia<br/>
        <a href="https://github.com/MarcoThePoro/mu-meet">View source on GitHub</a>
      </p>
    </div>
  </div>
</template>

<script>
import MdcButton from './MdcButton';
import MumeetLogo from './MumeetLogo';

const THRESHOLD = 0.1;

export default {
  components: {
    MdcButton,
    MumeetLogo,
  },
  data() {
    return {
      showHeaderGetStarted: false,
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
      this.showHeaderGetStarted =
        Math.max(...entries.map(x => x.intersectionRatio)) < THRESHOLD;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.wrapper {
  position: relative;
}

.header {
  height: 5.8rem;
  position: fixed;
  z-index: 1;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  background-color: rgba(#fff, 0.95);
  width: 100%;
}

.header_logo {
  font-size: 2.4rem;
}

section {
  padding: 3rem 4rem 2rem 4rem;
}

.section_headline {
  font-weight: 300;
}

.section--splash {
  top: 0;
  width: 100%;
  min-height: 100vh;
  height: 0;
  background: #ECEFF1;

  .section_headline {
    font-size: 3.6rem;
  }

  .get-started {
    margin-top: 2rem;
  }
}

.section--get-started {
  padding-bottom: 12rem;

  .section_headline {
    font-size: 2.6rem;
    margin-bottom: 0;
  }
  p {
    font-size: 1.6rem;
  }
  .get-started {
    margin-top: 2rem;
  }
}

.section--graphic {
  background: #B3E5FC;
  height: 32rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: 'Pretty graphic coming soon :)'
  }
}

.section_centered {
  display: flex;
  justify-content: center;
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
}

.section_vertical-align {
  display: flex;
  align-items: center;
  height: 100%;
}

.get-started {
  background-color: #2196F3;
  color: white;
  line-height: 2.6rem;
}

.footer {
  color: #FFFFFF;
  background-color: #4F4F4F;
  padding: 1rem 1rem 2rem 1rem;
  font-size: 1rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: 300;
}

.author-link, b {
  font-weight: 500;
}

.drop-in {

  &-enter-active, &-leave-active {
    will-change: transform, opacity;
  }

  &-enter-active {
    $duration: 500ms;
    transition: mdc-animation-enter(opacity, $duration), mdc-animation-enter(transform, $duration);
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
