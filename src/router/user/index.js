import dashboard from './dashboard';
import calendars from './calendars';
import RouterView from '@/router/RouterView';

export default {
  path: 'my',
  component: RouterView,
  children: [dashboard, calendars],
  meta: { requiresAuth: true },
};
