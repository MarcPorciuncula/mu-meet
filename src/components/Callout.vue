<template>
  <layout-section tag="div" class="callout" padding="less">
    <layout-container padding="less">
      <type-container>
        <type-text tag="h3" type="headline">
          <slot name="headline"></slot>
        </type-text>
        <type-text tag="p" type="body1">
          <slot name="body"></slot>
        </type-text>
        <div class="callout_actions">
          <slot name="actions"></slot>
        </div>
      </type-container>
    </layout-container>
  </layout-section>
</template>

<script>
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcButton from '@/components/Material/Button';
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';

export default {
  components: {
    TypeContainer,
    TypeText,
    LayoutContainer,
    LayoutSection,
    MdcButton,
  },
};
</script>

<style scoped lang="scss">
.callout {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.2rem;
  background-color: #fff;
}

.callout_actions {
  text-align: right;
  margin-bottom: -0.5rem;
}
</style>
