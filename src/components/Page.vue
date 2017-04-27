<template>
  <div class="wrapper">
    <div class="background-gradient"></div>
    <div class="background-image"></div>
    <div class="header-bar">
      <mumeet-logo></mumeet-logo>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import MumeetLogo from './MumeetLogo';

export default {
  components: {
    MumeetLogo,
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 100vh;
  position: relative;
}

.background-image,
.background-gradient {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.background-image {
  background: url("../assets/clock-splash.jpg"), #E3E9E4;
  background-size: auto 140vmax;
  background-position: 0 100%;
  z-index: -2;
}

.background-gradient {
  background: linear-gradient(#F9FAFC, rgba(#F9FAFC, 0.9) 30%, rgba(#F9FAFC, 0) 80%, transparent), rgba(#F9FAFC, 0.1);
  z-index: -1;
}

.header-bar,
.content {
  padding: 2rem;
  color: var(--type-color);
}

.header-bar {
  font-size: 2.4rem;
}

.content {
  font-size: 2.4rem;
}
</style>
