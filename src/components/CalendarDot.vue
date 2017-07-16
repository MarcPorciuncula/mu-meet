<template>
  <component
    :is="tag"
    :class="['calendar-dot', {
      'calendar-dot--empty': !color,
    }]"
    :style="`background-color: ${color || 'rgba(0, 0, 0, 0)'}`"
  />
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    color: VueTypes.string,
    tag: VueTypes.string.def('span'),
  },
}
</script>

<style scoped lang="scss">
.calendar-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: block;
}

.calendar-dot--empty {
  border: solid 1px #CFD8DC;
}
</style>
