<template>
  <div>
    <div class="splash min-vh-75 min-vh-100-ns pb1 flex flex-column items-center">
      <div class="mw8 flex items-center justify-between ph3 pt2 w-100 h3">
        <span class="f4 bb b--gray">MUmeet</span>
        <a href="/signin">
          <mdc-button compact>Sign In / Start</mdc-button>
        </a>
      </div>
      <div class="mw8 w-100 flex flex-column" style="flex-grow: 1">
        <div class="pa4 mt3 mw6-ns flex items-center ml5-l" style="flex-grow: 1">
          <div class="mb5">
            <h1 class="f2 fw3 lh-title measure-narrow">
              Find meeting times fast, so you can focus on the real work.
            </h1>
            <p class="f4 lh-copy measure">
              MUmeet finds meeting times based on your team's calendars.
            </p>
            <mdc-button raised>Get started</mdc-button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-column items-center">
      <div class="pa4 mw7">
        <p class="f3 fw4 lh-copy measure">
          Enough with staring at each other's calendars.
        </p>
        <p class="f4 fw3 lh-copy measure">
          Your own timetable is hard enough to keep track of. It's time to say goodbye to staring at everyone's calendars side by side.
        </p>
        <p class="f3 fw4 lh-copy measure">
          No more stabbing in the dark to find meeting times.
        </p>
        <p class="f4 fw3 lh-copy measure">
          We've all been there. It's due in four days but it's only half done. You still need Rhea to write the discussion and Amelia needs to redo all the diagrams because James labelled them all wrong, but what you need most of all is a time to work together before it's due.
        </p>
        <div class="flex justify-center">
          <div class="measure mv4-ns">
            <gifv
              preload
              inner-class="w-100 h-auto"
              poster="/static/video/RonnyChiengClip_poster.jpg"
              width="1080"
              height="720"
              :sources="[{ src: '/static/video/RonnyChiengClip_compressed.mp4', type: 'video/mp4' }]"
            />
            <div class="tr">
              <span class="f7 gray">Ronny Chieng: International Student - ABC, 2017</span>
            </div>
            <blockquote class="ml0 pl3 lh-copy bl">
              <p class="f5 mb0">Any other time is perfect, I promise. 5pm? No I can't do that.</p>
              <cite class="f6 fs-normal">- teammate</cite>
            </blockquote>
          </div>
        </div>
        <p class="f3 fw4 lh-copy measure">
          Find all your possible meeting times.
        </p>
        <p class="f4 fw3 lh-copy measure">
          MUmeet fetches your Monash timetable and your Google Calendar, then uses them to suggest times when you and your whole team are free.
        </p>
      </div>
    </div>
    <div class="flex flex-column justify-center bg-white">
      <div class="pt6 pb6 pl4 pr4 flex justify-center">
        <div class="measure">
          <p class="f2 fw3 lh-title">
            Round up your team and find a better meeting time, it's easy with MUmeet.
          </p>
          <div class="tc">
            <mdc-button raised>Find a time</mdc-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MdcButton from '@/components/Material/Button';
import Gifv from '@/components/Gifv';

export default {
  components: {
    MdcButton,
    Gifv,
  },
};
</script>

<style scoped lang="scss">
.min-vh-75 {
  min-height: 75vh;
}

.splash {
  background: url('../../assets/eric-rothermel-23788-greyscale-1080.jpg') no-repeat center left;
  background-size: cover;
}
</style>
