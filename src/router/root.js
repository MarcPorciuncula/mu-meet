import RouterView, { NamedRouterView } from '@/router/RouterView';
import landing from '@/router/landing';
import auth from '@/router/auth';
import user from '@/router/user';
import planner from '@/router/planner';

import Planner from '@/views/Planner';

export default {
  path: '/',
  components: {
    default: RouterView,
    'header-bar-control': Object.assign(NamedRouterView, { name: 'header-bar-control' }),
  },
  children: [
    landing,
    auth,
    user,
    planner,
    {
      path: 'planner',
      name: 'planner-test',
      components: {default: Planner},
      meta: { title: 'Meeting Planner' },
    },
  ],
};
