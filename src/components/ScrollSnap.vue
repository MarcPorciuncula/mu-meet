<template>
  <component :is="component">
    <slot></slot>
  </component>
</template>

<script>
import VueTypes from 'vue-types';
import jump from 'jump.js';

function onScroll(cb) {
  let ticking = false;
  let scrollY = 0;

  const handler = () => {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        cb(scrollY);
        ticking = false;
      });
    }
    ticking = true;
  };

  document.addEventListener('scroll', handler);
  return () => document.removeEventListener('scroll', handler);
}

export default {
  props: {
    offset: VueTypes.number,
    threshold: VueTypes.number.isRequired,
    component: VueTypes.string.def('div'),
  },
  data() {
    return {
      top: 0,
      distance: 0,
    };
  },
  mounted() {
    this.disposeScrollListener = onScroll(this.update);
  },
  methods: {
    update(top) {
      this.top = top;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.handleScrollStop();
      }, 150);
    },
    handleScrollStop() {
      const distance = this.$el.getBoundingClientRect().top - this.offset;
      if (Math.abs(distance) < this.threshold && Math.abs(distance) !== 0) {
        this.center();
      }
    },
    center() {
      jump(this.$el, { offset: -this.offset, duration: 250 });
    },
    computeDistance() {
      this.distance = this.$el.getBoundingClientRect().top - this.offset;
    },
  },
  watch: {
    scrollY() {
      this.computeDistance();
    },
    offset() {
      this.computeDistance();
    },
  },
  beforeDestroy() {
    this.disposeScrollListener();
  },
};
</script>
