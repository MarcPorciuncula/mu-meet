const Landing = () => import('@/views/LandingPage');
const HeaderBarControl = () => import('@/views/LandingPage/HeaderBarControl');

export default {
  path: '/',
  components: { default: Landing, 'header-bar-control': HeaderBarControl },
};
