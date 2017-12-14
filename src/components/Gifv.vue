<template>
  <video
    @click="toggle()"
    @mouseleave="pause()"
  >
    <source
      v-for="source of sources"
      :src="source.src"
      :key="source.src"
      :type="source.type"
    />
    No sources available
  </video>
</template>

<script>
export default {
  props: {
    sources: {},
  },
  methods: {
    toggle() {
      if (!this.$el.paused) {
        this.$el.pause();
      } else {
        this.$el.play();
      }
    },
    pause() {
      this.$el.pause();
    },
  },
};
</script>
