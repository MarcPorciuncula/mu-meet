export default {
  render: h => h('router-view'),
};

export const NamedRouterView = {
  render(h) {
    return h('router-view', { props: { name: this.$options.name } });
  },
};
