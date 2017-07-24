<template>
  <li
    class="mdc-list-item"
    role="option"
    tabindex="0"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </li>
</template>

<script>
import './select.scss';

export default {};
</script>
