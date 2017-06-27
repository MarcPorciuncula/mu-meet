<template>
  <layout-section padding="normal">
    <layout-container>
      <type-container>
        <type-text tag="h3" type="subheading2">
          Meeting times
        </type-text>
      </type-container>
    </layout-container>
    <layout-container padding="min">
      <mdc-list-group>
        <div v-for="day, key, index in days" :key="key">
          <mdc-list-group-header>
            {{ day[0].start | format('dddd Do MMMM') }}
          </mdc-list-group-header>
          <mdc-list>
            <mdc-list-item v-for="meeting in day" :key="meeting.start.toString()">
              {{ meeting.start | format('h:mma') }}
              to
              {{ meeting.end | format('h:mma')}}
              <span slot="secondary-text">
                {{ meeting | getDurationInWords }}
              </span>
            </mdc-list-item>
          </mdc-list>
          <mdc-list-group-divider v-if="index !== Object.keys(days).length - 1" />
        </div>
        </mdc-list-group>
    </layout-container>
  </layout-section>
</template>

<script>
import VueTypes from 'vue-types';
import R from 'ramda';
import format from 'date-fns/format';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeContainer, TypeText } from '@/components/Material/Typography';
import {
  List as MdcList,
  ListItem as MdcListItem,
  ListGroup as MdcListGroup,
  ListGroupHeader as MdcListGroupHeader,
  ListGroupDivider as MdcListGroupDivider,
} from '@/components/Material/List';

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeContainer,
    TypeText,
    MdcList,
    MdcListItem,
    MdcListGroup,
    MdcListGroupHeader,
    MdcListGroupDivider,
  },
  props: {
    meetings: VueTypes.arrayOf(
      VueTypes.shape({
        start: VueTypes.instanceOf(Date).isRequired,
        end: VueTypes.instanceOf(Date).isRequired,
        duration: VueTypes.number.isRequired,
      }).loose,
    ).isRequired,
  },
  computed: {
    days() {
      return R.groupBy(meeting => format(meeting.start, 'DD-MM-YYYY'))(
        this.meetings,
      );
    },
  },
  methods: {},
  filters: {
    format,
    getDurationInWords({ start, end, duration }) {
      let result = '';
      if (Math.floor(duration / 60) !== 0) {
        result += getDistanceInWordsStrict(start, end, { unit: 'h' });
      }
      if (duration % 60 !== 0) {
        // FIXME this assumes that any non hour duration is a half hour duration
        result = result
          ? result.replace(/^(.+) hours?/, `$1 and a half hours`)
          : 'Half an hour';
      }
      return result;
    },
  },
};
</script>
