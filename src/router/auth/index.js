import signin from './signin';
import signout from './signout';
import RouterView from '@/router/RouterView';

export default {
  path: '',
  component: RouterView,
  children: [signin, signout],
};
