const Landing = () => import('@/views/LandingPage');

export default {
  name: 'landing-page',
  path: '',
  components: { default: Landing },
  meta: {
    hideHeaderBar: true,
  },
};
