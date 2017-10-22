import RouterView, { NamedRouterView } from '@/router/RouterView';
import landing from '@/router/landing';
import auth from '@/router/auth';
import user from '@/router/user';
import planner from '@/router/planner';

export default {
  path: '/',
  components: {
    default: RouterView,
    'header-bar-control': Object.assign(NamedRouterView, {
      name: 'header-bar-control',
    }),
  },
  children: [landing, auth, user, planner],
};
