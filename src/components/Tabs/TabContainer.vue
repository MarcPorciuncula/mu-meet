<template>
  <div class="tab-container">
    <div
      class="tab-container__inner"
      :style="{
        '--tab-count': tabs.length,
        'transform': animating ? `translateX(calc(-100vw * ${index}))` : null,
        'will-change': animating ? 'transform' : null,
        'margin-left': animating ? null : `calc(-100vw * ${index})`,
        'transition': transitioning ? null : 'none',
      }"
      ref="inner"
    >
      <div v-for="tab in tabs" class="tab-container__tab">
        <slot :name="tab.id" />
      </div>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import Vue from 'vue';

// HACK This component is very careful to disable css transforms and use margin
// positioning at times when it's not animating. This is to prevent fixed positioned
// children from being positioned incorrectly due to the fact that fixed positioning
// and transforms don't work together.

const tick = () =>
  new Promise(resolve => Vue.nextTick(() => requestAnimationFrame(resolve)));

export default {
  props: {
    tabs: VueTypes.arrayOf(
      VueTypes.shape({
        id: VueTypes.string,
      }),
    ),
    active: VueTypes.string,
  },
  data() {
    return {
      animating: false,
      transitioning: false,
      index: 0,
    };
  },
  mounted() {
    this.$refs.inner.addEventListener('transitionend', async () => {
      await tick();
      this.animating = false;
      this.transitioning = false;
    });
  },
  computed: {
    offset() {
      return `calc(-100vw * ${this.index})`;
    },
  },
  watch: {
    async active(next, prev) {
      if (next !== prev) {
        this.animating = true;
        await tick();
        this.transitioning = true;
        await tick();
        this.index = this.tabs.findIndex(tab => tab.id === this.active);
      }
    },
  },
};
</script>

<style scoped lang="scss">
// http://easings.net/#easeInOutQuart
$quart: cubic-bezier(0.77, 0, 0.175, 1);

.tab-container {
  width: 100vw;
  max-height: 100vh;
  overflow-x: hidden;
}

.tab-container__inner {
  width: calc(100vw * var(--tab-count));
  display: flex;
  transition: transform 250ms $quart;
  max-height: 100%;
}

.tab-container__tab {
  width: 100vw;
  overflow-x: hidden;
  overflow-y: scroll;
  height: auto;
  display: block;
}
</style>
