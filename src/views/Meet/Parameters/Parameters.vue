<template>
  <layout-section padding="normal">
    <layout-container>
      <type-container>
        <type-text tag="h3" type="subheading2">
          Parameters
        </type-text>
        <type-text tag="h4" type="subheading1">
          Search dates
        </type-text>
        <type-text tag="p" type="body1">
          Look for meeting times over these dates
        </type-text>
        <!-- <mdc-button dense>This week</mdc-button>
        <mdc-button dense>Next week</mdc-button> -->
        <div class="date-picker">
          <mdc-form-field label="Start">
            <datepicker
              :value="startDate"
              :disabled="{ from: endDate }"
              :highlighted="{ from: startDate, to: endDate }"
              @selected="$emit('start-date-changed', $event)"
            />
          </mdc-form-field>
        </div>
        <div class="date-picker">
          <mdc-form-field label="End">
            <datepicker
              :value="endDate"
              :disabled="{ to: startDate }"
              :highlighted="{ from: startDate, to: endDate }"
              @selected="$emit('end-date-changed', $event)"
            />
          </mdc-form-field>
        </div>
        <type-text tag="p" type="body1">
          More parameters including day of week restrictions, minimum duration, and hour restrictions coming soon.
        </type-text>
        <div style="text-align: right">
          <mdc-button @click="done()">
            Done
          </mdc-button>
        </div>
      </type-container>
    </layout-container>
  </layout-section>
</template>

<script>
import VueTypes from 'vue-types';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcFormField from '@/components/Material/FormField';
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import MdcTextField from '@/components/Material/TextField';
import Datepicker from 'vuejs-datepicker';
import MdcButton from '@/components/Material/Button';

export default {
  props: {
    startDate: VueTypes.oneOfType([Date]).isRequired,
    endDate: VueTypes.oneOfType([Date]).isRequired,
    done: VueTypes.func.def(() => {}),
  },
  components: {
    TypeContainer,
    TypeText,
    MdcFormField,
    LayoutContainer,
    LayoutSection,
    MdcTextField,
    Datepicker,
    MdcButton,
  },
};
</script>

<style scoped lang="scss">
.date-picker {
  padding: 0.5rem 0 1rem 0;
}
</style>
