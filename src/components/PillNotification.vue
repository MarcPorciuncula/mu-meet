<template>
  <div class="pill-notification-wrapper">
    <transition name="slide-fade" appear>
      <div
        v-if="show"
        class="pill-notification"
      >
        <type-text tag="span" type="body2">
          New meetings found.
        </type-text>
      </div>
    </transition>
  </div>
</template>

<script>
import { TypeText } from '@/components/Material/Typography';

export default {
  components: {
    TypeText,
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    setInterval(() => {
      this.show = !this.show;
    }, 900);
  },
};
</script>

<style scoped lang="scss">
@import "@material/animation/functions";

.pill-notification-wrapper {
  position: absolute;
  bottom: 0.25rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.pill-notification {
  background-color: #283593;
  height: 1.75rem;
  border-radius: 1.125rem;
  padding: 0.125rem 1rem;
  width: contain;

  .type {
    color: white;
  }
}

.slide-fade-enter-active {
  transition: mdc-animation-enter(opacity, 175ms), mdc-animation-enter(transform, 175ms);
}
.slide-fade-leave-active {
  transition: mdc-animation-exit-permanent(opacity, 175ms), mdc-animation-exit-permanent(transform, 175ms);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(25%);
  opacity: 0;
}
</style>
