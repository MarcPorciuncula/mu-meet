<template>
  <div class="w-100 flex flex-column items-center">
    <Inner :linkto="linkto" />
  </div>
</template>

<script>
import Inner from './Inner';

export default {
  props: {
    linkto: {},
  },
  components: {
    Inner,
  },
};
</script>
