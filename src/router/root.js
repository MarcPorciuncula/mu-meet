import RouterView from '@/router/RouterView';
import landing from '@/router/landing';
import auth from '@/router/auth';
import user from '@/router/user';
import planner from '@/router/planner';

export default {
  path: '/',
  components: {
    default: RouterView,
    footer: { render: h => h('router-view', { props: { name: 'footer' } }) },
  },
  children: [landing, auth, user, planner],
};
