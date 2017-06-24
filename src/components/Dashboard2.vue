<template>
  <div class="dashboard-section">
    <layout-section>
      <layout-container tag="section" padding="less">
        <callout/>
        <mdc-list>
          <mdc-list-item>
            Start a meeting plan
          </mdc-list-item>
          <mdc-list-item>
            Join a meeting plan
          </mdc-list-item>
          <mdc-list-item separator />
          <mdc-list-item>
            My calendars
          </mdc-list-item>
          <mdc-list-item>
            Past meeting plans
          </mdc-list-item>
        </mdc-list>
      </layout-container>
    </layout-section>
  </div>
</template>

<script>
import LayoutContainer from './Layout/Container';
import MdcList from './Material/List';
import MdcListItem from './Material/ListItem';
import Callout from './Components/Callout';
import LayoutSection from './Layout/Section';

export default {
  components: {
    LayoutContainer,
    LayoutSection,
    MdcList,
    MdcListItem,
    Callout,
  },
};
</script>

<style scoped lang="scss">
.dashboard-section {
  min-height: 72vh;
  height: 0;
}
</style>
