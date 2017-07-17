const Landing = () => import('@/views/LandingPage');
const HeaderBarControl = () => import('@/views/LandingPage/HeaderBarControl');

export default {
  name: 'landing-page',
  path: '',
  components: { default: Landing, 'header-bar-control': HeaderBarControl },
};
