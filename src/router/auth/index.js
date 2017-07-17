import signin from './signin';
import signout from './signout';
import RouterView, { NamedRouterView } from '@/router/RouterView';

export default {
  path: '',
  components: {
    default: RouterView,
    'header-bar-control': Object.assign(NamedRouterView, { name: 'header-bar-control' }),
  },
  children: [
    signin,
    signout,
  ],
};
