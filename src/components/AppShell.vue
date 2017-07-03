<template>
  <div class="app-shell">
    <header-bar
      ref="header"
      :show-title="showTitle"
      :title="$route.meta.title"
      :message="loadingMessage"
    >
      <div slot="controls">
        <slot name="header-bar-control"></slot>
      </div>
    </header-bar>
    <section class="section-title" ref="title">
      <layout-container class="section-title_inner">
        <type-container>
          <type-text tag="h2" type="title" :class="{ hidden: showTitle }">
            {{ $route.meta.title }}
          </type-text>
        </type-container>
      </layout-container>
    </section>
    <div class="content">
      <slot></slot>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderBar from './HeaderBar';
import PageFooter from './Footer';
import { TypeContainer, TypeText } from './Material/Typography';
import LayoutSection from './Layout/Section';
import LayoutContainer from './Layout/Container';
import { PROGRESS_MESSAGE } from '@/store/getters';

export default {
  components: {
    HeaderBar,
    PageFooter,
    TypeContainer,
    TypeText,
    LayoutSection,
    LayoutContainer,
  },
  data() {
    return {
      showTitle: false,
    };
  },
  mounted() {
    this.intersectionObserver = new IntersectionObserver(
      this.updateIntersection,
      {
        threshold: [0.5, 0],
      },
    );
    this.intersectionObserver.observe(this.$refs.title.$el);
  },
  computed: {
    ...mapGetters({
      loadingMessage: PROGRESS_MESSAGE,
    }),
  },
  methods: {
    updateIntersection(entries) {
      entries.forEach(
        entry => (this.showTitle = entry.intersectionRatio < 0.5),
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';
@import '@material/elevation/mixins';

.app-shell {
  min-height: 100vh;
  position: relative;
  background-color: #F5F5F5;
}

.section-title {
  padding-top: 3.625rem;

  &_inner {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }

  .type {
    margin-bottom: 0;
  }
}

.hidden {
  opacity: 0;
}

.content {
  min-height: 72vh;
}
</style>
