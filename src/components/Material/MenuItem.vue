<template>
  <li
    class="mdc-list-item"
    role="menuitem"
    tabindex="0"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </li>
</template>
