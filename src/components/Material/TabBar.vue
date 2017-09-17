<template>
  <nav class="mdc-tab-bar mdc-tab-bar--icon-tab-bar">
    <a class="mdc-tab mdc-tab--active" href="#recents">
      <i class="material-icons mdc-tab__icon" aria-label="Recents">event</i>
    </a>
    <div style="flex-grow: 1"></div>
    <a class="mdc-tab" href="#favorites">
      <i class="material-icons mdc-tab__icon" aria-label="Favorites">favorite</i>
    </a>
    <a class="mdc-tab" href="#nearby">
      <i class="material-icons mdc-tab__icon" aria-label="nearby">person_pin</i>
    </a>
    <span class="mdc-tab-bar__indicator"></span>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '@material/tabs/mdc-tabs';
</style>
