<template>
  <layout-section padding="normal">
    <layout-container>
      <type-container>
        <type-text tag="h3" type="subheading2">
          Parameters
        </type-text>
      </type-container>
      <form name="meeting-planner-settings">
        <mdc-form-field id="start-date" label="Start date">
          <input type="text" id="start-date" />
        </mdc-form-field>
        <mdc-text-field label="Start Date" />
      </form>
    </layout-container>
  </layout-section>
</template>

<script>
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcFormField from '@/components/Material/FormField';
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import MdcTextField from '@/components/Material/TextField';

export default {
  components: {
    TypeContainer,
    TypeText,
    MdcFormField,
    LayoutContainer,
    LayoutSection,
    MdcTextField,
  },
};
</script>

<style scoped lang="scss">

</style>
