<template>
  <div class="relative">
    <span
      class="material-icons db white absolute center"
      v-show="!playing"
    >
      play_circle_filled
    </span>
    <video
      ref="video"
      @click="toggle()"
      @mouseleave="pause()"
      :width="width"
      :height="height"
      :poster="poster"
      :preload="preload"
      :class="innerClass"
    >
      <source
        v-for="source of sources"
        :src="source.src"
        :key="source.src"
        :type="source.type"
      />
      No sources available
    </video>
  </div>
</template>

<script>
export default {
  props: {
    sources: {},
    width: {},
    height: {},
    poster: {},
    preload: {},
    innerClass: {},
  },
  data() {
    return {
      playing: false,
    };
  },
  methods: {
    toggle() {
      if (!this.$refs.video.paused) {
        this.$refs.video.pause();
      } else {
        this.$refs.video.play();
      }
      this.playing = !this.$refs.video.paused;
    },
    pause() {
      this.$refs.video.pause();
      this.playing = false;
    },
  },
};
</script>

<style scoped lang="scss">
.center {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
