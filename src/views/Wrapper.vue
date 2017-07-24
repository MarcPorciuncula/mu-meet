<template>
  <div class="wrapper" id="root">
    <progress-bar class="header-bar">
      <header-bar v-show="!hideHeaderBar" :title="title" :show-title="title && !showTitle" :message="progressMessage">
        <router-view name="header-bar-control"></router-view>
      </header-bar>
    </progress-bar>
    <layout-section v-show="title" class="title-section" ref="title" padding="less">
      <layout-container class="title-section_inner">
        <type-container trim-bottom>
          <type-text tag="h2" type="title" :class="{ hidden: !showTitle }">
            {{ title }}
          </type-text>
        </type-container>
      </layout-container>
    </layout-section>
    <main class="content">
      <router-view></router-view>
    </main>
    <page-footer></page-footer>
    <error-dialog/>
  </div>
</template>

<script>
import { path } from 'ramda';
import ProgressBar from '@/components/GlobalProgressBar';
import LayoutSection from '@/components/Layout/Section';
import LayoutContainer from '@/components/Layout/Container';
import { TypeText, TypeContainer } from '@/components/Material/Typography';
import HeaderBar from '@/components/HeaderBar';
import PageFooter from '@/views/Footer';
import ErrorDialog from '@/views/ErrorDialog';
import { mapGetters } from 'vuex';
import { PROGRESS_MESSAGE } from '@/store/getters';

const getHideHeaderBar = path(['meta', 'hideHeaderBar']);
const getTitle = path(['meta', 'title']);

export default {
  components: {
    LayoutSection,
    LayoutContainer,
    TypeText,
    TypeContainer,
    HeaderBar,
    PageFooter,
    ProgressBar,
    ErrorDialog,
  },
  data() {
    return {
      showTitle: false,
    };
  },
  computed: {
    hideHeaderBar() {
      return this.$route.matched.reduce(
        (hideHeaderBar, route) =>
          typeof getHideHeaderBar(route) !== 'undefined'
            ? getHideHeaderBar(route)
            : hideHeaderBar,
        false,
      );
    },
    title() {
      return this.$route.matched.reduce(
        (title, route) => getTitle(route) || title,
        null,
      );
    },
    ...mapGetters({ progressMessage: PROGRESS_MESSAGE }),
  },
  mounted() {
    this.observer = new IntersectionObserver(this.update, {
      threshold: [1],
    });
    this.observer.observe(this.$refs.title.$el);
  },
  methods: {
    update(entries) {
      entries.forEach(entry => (this.showTitle = entry.intersectionRatio >= 1));
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 100vh;
  position: relative;
  background-color: #F5F5F5;
}

.content {
  min-height: 70vh;
}

.header-bar {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
}

.title-section {
  margin-top: 3.625rem;
}

.hidden {
  opacity: 0;
}
</style>
