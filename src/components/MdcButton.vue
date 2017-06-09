<template>
  <button class="mdc-button" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '@material/button/mdc-button';

.mdc-button {
  min-width: 6.4rem;
  height: 3.6rem;
  padding: 0 1.6rem;
  font-size: 1.4rem; // Override font to specifically be px as spec defined pt
  font-weight: 400;
  line-height: 3.6rem; // Override line-height so text aligns centered
  font-family: inherit;
  text-transform: initial;
}
</style>
