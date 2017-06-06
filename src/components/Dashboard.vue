<template>
  <div class="wrapper">
    <section class="section-main-action">
      <div class="main-action" v-mdc-ripple>
        <div>
          <p class="main-action_subtitle">
            <span class="underline">Get started</span>
          </p>
          <p class="main-action_headline">
            Start a<br/>meeting plan
          </p>
        </div>
      </div>
    </section>
    <section>
      <ul class="mdc-list">
        <li class="mdc-list-item menu-item" v-mdc-ripple ref="start">
          Start a meeting plan
          <span class="mdc-list-item__end-detail notification-dot notification-dot--accent"></span>
        </li>
        <li class="mdc-list-item menu-item" v-mdc-ripple>
          Join a meeting plan
        </li>
        <li role="separator" class="mdc-list-divider"></li>
        <li class="mdc-list-item menu-item" v-mdc-ripple>
          My calendars
          <span class="mdc-list-item__end-detail notification-dot"></span>
        </li>
        <li class="mdc-list-item menu-item" v-mdc-ripple>
          Past meeting plans
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import MdcRipple from '@/directives/mdc-ripple';

export default {
  directives: {
    MdcRipple,
  },
};
</script>

<style lang="scss">
@import '@material/list/mdc-list';
@import '@material/elevation/mixins';
@import '@material/ripple/mixins';

.section-main-action {
  padding: 2rem;
}

.main-action {
  @include mdc-elevation(4);
  @include mdc-ripple-bg((pseudo: '::before', base-color: white));
  @include mdc-ripple-fg((pseudo: '::after', base-color: white));

  display: flex;
  width: 100%;
  align-items: center;
  border-radius: 0.5rem;
  height: 22rem;
  padding: 2rem;
  color: white;
  background-color: #039BE5;
}

.main-action_headline {
  font-size: 3.6rem;
  line-height: 1.2em;
  font-weight: 700;
  margin: 0;
}

.main-action_subtitle {
  font-size: 1.6rem;
  margin: 0;
  margin-bottom: 1em;
  margin-top: -1em;
}

.underline {
  border-bottom: 1px solid white;
}

section {
  padding: 0 2rem;
}

.mdc-list {
  font-size: 1.6rem;
  font-family: inherit;
  line-height: 1.75em;
  letter-spacing: 0.02em;
}

.mdc-list-divider {
  margin: {
    top: 0.4rem;
    bottom: 0.4rem;
  }
}

.notification-dot {
  display: block;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  background-color: #BDBDBD;
}

.notification-dot--accent {
  background-color: #039BE5;
}

.mdc-list-item.mdc-ripple-upgraded {
  // HACK when the list item is given a ripple, the list item is moved left and given padding, so the ripple bleeds over to the edge of the list, however the width is wrong
  width: calc(100% + 2 * #{$mdc-list-side-padding});
}
</style>
