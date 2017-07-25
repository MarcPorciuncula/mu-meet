<template>
  <layout-section class="dialog">
    <transition name="slide-up" appear>
      <layout-container class="dialog_inner" v-if="error">
        <type-container>
          <type-text tag="h3" type="subheading2">
            MUmeet has run into an unknown error.
          </type-text>
          <type-text tag="p" type="body1">
            As MUmeet is still under construction, there are still many bugs yet to be found and fixed. An error report has already been sent to the developer.
          </type-text>
          <type-text tag="p" type="body1">
            You can try refreshing the page, or if nothing looks out of place, you can click out of this dialog and continue on as normal.
          </type-text>
        </type-container>
        <pre v-html="error.stack || JSON.stringify(error)" class="stack"></pre>
      </layout-container>
    </transition>
  </layout-section>
</template>

<script>
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import Observable from '@/util/subscriptions/Observable';

const data = {
  error: null,
};
const observable = new Observable();

window.addEventListener('click', event => {
  observable.next(event);
});

window.onunhandledrejection = event => {
  data.error = event.reason;
  console.error('Unhandled promise rejection\n', event.reason);
};

window.addEventListener('error', event => {
  data.error = event;
});

// TODO handle synchronous errors properly
// TODO intercept console.error???

export default {
  components: {
    TypeText,
    TypeContainer,
    LayoutSection,
    LayoutContainer,
  },
  data() {
    return data;
  },
  created() {
    observable.subscribe({
      next: event => {
        if (!this.$el.contains(event.target) && this.error) {
          this.error = null;
        }
      },
      error: console.error.bind(console),
      complete: () => {},
    });
  },
};
</script>

<style scoped lang="scss">
@import '@material/elevation/mixins';
@import '@material/animation/functions';

.dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.dialog_inner {
  @include mdc-elevation(14);
  background-color: #E53935;
  margin-left: 1rem;
  margin-right: 1rem;
  width: calc(100% - 2rem) !important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-top: 1rem !important;
}

.type {
  color: white;
}

.stack {
  overflow-x: scroll;
  background-color: #FF8A80;
  padding: 0.5rem;
  font-size: 0.8rem;
}

.slide-up {
  &-enter-active {
    $duration: 600ms;
    $delay: 300ms;
    transition: mdc-animation-enter(opacity, $duration, $delay), mdc-animation-enter(transform, $duration, $delay);
  }

  &-leave-active {
    $duration: 300ms;
    transition: mdc-animation-exit-permanent(opacity, $duration), mdc-animation-exit-permanent(transform, $duration);
  }

  &-enter {
    opacity: 0;
    transform: translateY(50%);
  }

  &-leave-to {
    opacity: 0;
    transform: translateY(50%);
  }
}
</style>
