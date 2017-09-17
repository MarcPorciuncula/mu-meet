<template>
  <div>
    <layout-section>
      <hero-tab-bar
        :tabs="[{ icon: 'event', id: 'meetings' }, { icon: 'people', id: 'team' }, { icon: 'tune', id: 'configure' }]"
        :active="active"
        @change="change($event)"
      />
    </layout-section>
  </div>
</template>

<script>
import HeroTabBar from '@/components/Tabs/HeroTabBar';

export default {
  name: 'Planner',
  components: {
    HeroTabBar,
  },
  data() {
    return {
      active: 'meetings',
    };
  },
  mounted() {
    setTimeout(() => (this.active = 'configure'), 400);
  },
  methods: {
    change(id) {
      console.log('change', id)
      this.active = id;
    }
  }
};
</script>

<style scoped lang="scss">

</style>
