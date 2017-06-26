<template>
  <layout-section tag="div" class="callout" padding="less">
    <layout-container padding="less">
      <type-container>
        <type-text tag="h3" type="headline">
          <slot name="headline">
            Resume your meeting plan
          </slot>
          <!-- Choose your calendars -->
        </type-text>
        <type-text tag="p" type="body1">
          <slot name="body">
          You started a meeting plan with Jessie, Sam, and Rhea five minutes ago.
          <!-- MUmeet needs to know which of your calendars to schedule around. -->
          </slot>
        </type-text>
        <div class="callout_actions">
          <slot name="actions">
            <mdc-button>
              Archive
            </mdc-button>
            <mdc-button>
              Resume
              <!-- Go to My calendars -->
            </mdc-button>
          </slot>
        </div>
      </type-container>
    </layout-container>
  </layout-section>
</template>

<script>
import { TypeContainer, TypeText } from '../Material/Typography';
import MdcButton from '../Material/Button';
import LayoutContainer from '../Layout/Container';
import LayoutSection from '../Layout/Section';

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
  margin: 0 -0.5rem -0.5rem -0.5rem;
}
</style>
