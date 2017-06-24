<template>
  <layout-container class="callout" padding="less">
    <type-container>
      <type-text tag="h3" type="headline">
        Resume your meeting plan
        <!-- Choose your calendars -->
      </type-text>
      <type-text tag="p" type="body1">
        You started a meeting plan with Jessie, Sam, and Rhea five minutes ago.
        <!-- MUmeet needs to know which of your calendars to schedule around. -->
      </type-text>
      <div class="callout_actions">
        <mdc-button>
          Archive
        </mdc-button>
        <mdc-button>
          Resume
          <!-- Go to My calendars -->
        </mdc-button>
      </div>
    </type-container>
  </layout-container>
</template>

<script>
import { TypeContainer, TypeText } from '../Material/Typography';
import MdcButton from '../Material/Button';
import LayoutContainer from '../Layout/Container';

export default {
  components: {
    TypeContainer,
    TypeText,
    LayoutContainer,
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
