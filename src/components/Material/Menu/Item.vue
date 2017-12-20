<template>
  <MdcListItem
    role="menuitem"
    tabindex="0"
  >
    <slot></slot>
  </MdcListItem>
</template>

<script>
import MdcListItem from '@/components/Material/List/Item';

export default {
  name: 'MenuItem',
  components: {
    MdcListItem,
  },
};
</script>
