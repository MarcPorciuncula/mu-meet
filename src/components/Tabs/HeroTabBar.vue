<!--
HeroTabBar

A tab navigation bar that visually features the primary (first) tab by left justifying it
and right justifying the rest.
-->

<template>
  <nav class="tab-bar">
    <template v-for="tab, i in tabs">
      <a
        href="#"
        :class="['tab-bar__tab', { 'tab-bar__tab--active': active === tab.id }]"
        @click.prevent="$emit('change', tab.id)"
      >
        <i class="material-icons">{{ tab.icon }}</i>
      </a>
      <div v-if="i === 0" class="tab-bar__separator" ref="separator"></div>
    </template>
    <span class="tab-bar__indicator" :style="{ transform: `translateX(${indicatorOffset})` }"></span>
  </nav>
</template>

<script>

import VueTypes from 'vue-types';

export default {
  props: {
    tabs: VueTypes.arrayOf(VueTypes.shape({
      icon: VueTypes.string,
      id: VueTypes.string,
    })),
    active: VueTypes.string,
  },
  data() {
    return {
      separatorWidth: 0,
    };
  },
  mounted() {
    this.separatorWidth = this.$refs.separator[0].getBoundingClientRect().width;
  },
  computed: {
    indicatorOffset() {
      if (this.active === this.tabs[0].id) {
        return '0';
      } else {
        const position = this.tabs.findIndex(tab => tab.id === this.active);
        return `calc(${this.separatorWidth}px + ${position} * 64px)`;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@material/animation/functions';

.tab-bar {
  width: 100%;
  height: 52px;
  display: flex;
  position: relative;
}

.tab-bar__tab {
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #616161;
}

.tab-bar__tab--active {
  color: #212121;
}

.tab-bar__separator {
  flex-grow: 1;
  border-left: 1px solid #E0E0E0;
  height: calc(52px - 24px);
  margin: calc(24px / 2) 0;
}

.tab-bar__indicator {
  background-color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 64px;
  height: 2px;
  transition: mdc-animation-enter(transform, 240ms);
}
</style>
