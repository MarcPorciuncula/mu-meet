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
      <type-container>
        <type-text tag="h2" type="title" :class="{ hidden: showTitle }">
          {{ $route.meta.title }}
        </type-text>
      </type-container>
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

export default {
  components: {
    HeaderBar,
    PageFooter,
    TypeContainer,
    TypeText,
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
    this.intersectionObserver.observe(this.$refs.title);
  },
  computed: {
    ...mapGetters({
      loadingMessage: 'getLoadingMessage',
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
}

.section-title {
  padding: 1.5rem;
  padding-top: calc(3.625rem + 0.8rem);
  padding-bottom: 1rem;

  .type {
    margin-bottom: 0;
  }
}

.hidden {
  opacity: 0;
}
</style>
