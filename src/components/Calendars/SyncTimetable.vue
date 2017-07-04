<template>
  <layout-section padding="none">
    <layout-container padding="less">
      <callout>
        <span slot="headline">
          Sync your Monash timetable
        </span>
        <span slot="body">
          Don't have your timetable synced yet? Visit <a target="_blank" href="https://my.monash.edu.au/news-and-events/calendar-feeds/direct.html">My Monash Calendar Feeds</a> for instructions on importing your timetable to Google Calendar.
        </span>
        <template slot="actions">
          <mdc-button compact>
            Dismiss
          </mdc-button>
        </template>
      </callout>
    </layout-container>
  </layout-section>
</template>

<script>
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import MdcButton from '@/components/Material/Button';
import Callout from '@/components/Callout';

export default {
  components: {
    LayoutContainer,
    LayoutSection,
    TypeContainer,
    TypeText,
    MdcButton,
    Callout,
  },
};
</script>

<style scoped lang="scss">
a {
  border-bottom: 1px solid black;
}
</style>
