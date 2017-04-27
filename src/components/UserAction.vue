<template>
  <span class="user-action" v-on:click="$emit('click', $event)">
    <slot>

    </slot>
  </span>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">

.user-action {
  color: #607D8B;
  text-transform: lowercase;
  --underline-style: dotted;
  border-bottom: var(--underline-style) 1px #607D8B;

  &:hover, &:focus {
    --underline-style: solid;
  }
}

</style>
