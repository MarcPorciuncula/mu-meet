const Landing = () => import('@/views/LandingPage');
const Footer = () => import('@/views/Footer');

export default {
  name: 'landing-page',
  path: '',
  components: { default: Landing, footer: Footer },
  meta: {
    hideHeaderBar: true,
  },
};
