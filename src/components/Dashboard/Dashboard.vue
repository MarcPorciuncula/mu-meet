<template>
  <div class="dashboard">
    <layout-section>
      <layout-container tag="section" padding="less">
        <callout v-if="lastMeetingPlan">
          <span slot="headline">
            Resume your meeting plan
          </span>
          <span slot="body">
            You started a meeting plan with
            {{ Object.values(lastMeetingPlan.users).map(x => x.profile.given_name) | list }}
            {{ [now, lastMeetingPlan.startedAt] | distanceInWords }}.
          </span>
        </callout>
        <mdc-list ripple>
          <template v-for="action in actions">
            <mdc-list-item v-if="!action" separator />
            <router-link v-else-if="action.route" :to="action.route.path">
              <mdc-list-item ripple>
                {{ action.text }}
              </mdc-list-item>
            </router-link>
            <mdc-list-item v-else>
              {{ action.text }}
            </mdc-list-item>
          </template>
        </mdc-list>
      </layout-container>
    </layout-section>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import LayoutContainer from '@/components/Layout/Container';
import LayoutSection from '@/components/Layout/Section';
import MdcList from '@/components/Material/List';
import MdcListItem from '@/components/Material/ListItem';
import Callout from '@/components/Components/Callout';
import distanceInWords from 'date-fns/distance_in_words';

export default {
  props: {
    lastMeetingPlan: VueTypes.shape({
      startedAt: VueTypes.instanceOf(Date).isRequired,
      users: VueTypes.shape({
        profile: VueTypes.shape({ given_name: VueTypes.string }),
      }).loose.isRequired,
    }),
    actions: VueTypes.arrayOf(
      VueTypes.oneOfType([
        VueTypes.shape({
          text: VueTypes.string.isRequired,
        }),
        VueTypes.oneOf([null]),
      ]),
    ),
  },
  data() {
    return {
      now: new Date(),
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 6e3);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  components: {
    LayoutContainer,
    LayoutSection,
    MdcList,
    MdcListItem,
    Callout,
  },
  filters: {
    distanceInWords([a, b]) {
      return distanceInWords(a, b, { addSuffix: true });
    },
    list(items) {
      let result = items.join(', ');

      const re = /, ([^,]+?)$/;

      if (items.length > 2) {
        result = result.replace(re, ', and $1');
      } else if (items.length > 1) {
        result = result.replace(re, ' and $1');
      }
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
