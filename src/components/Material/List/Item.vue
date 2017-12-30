<template>
  <li
    class="mdc-list-item"
    @click="$emit('click', $event)"
  >
    {{/* TODO start-detail will be renamed to graphic in the next version of @material/list */}}
    <span
      v-if="$slots.graphic"
      class="mdc-list-item__start-detail"
    >
      <slot name="graphic" />
    </span>
    <span class="mdc-list-item__text">
      <slot />
      <span
        v-if="$slots.secondary"
        class="mdc-list-item__secondary-text"
      >
        <slot name="secondary" />
      </span>
    </span>
    {{/* TODO end-detail will be renamed to meta in the next version of @material/list */}}
    <span
      v-if="$slots.meta"
      class="mdc-list-item__end-detail"
    >
      <slot name="meta"></slot>
    </span>
  </li>
</template>

<script>
export default {
  name: 'MdcListItem',
};
</script>
