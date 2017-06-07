import SelectCalendars from '@/components/SelectCalendars';
import ProfileBadge from '@/components/ProfileBadge';

export default {
  path: '/calendars',
  name: 'SelectCalendars',
  components: {
    default: SelectCalendars,
    'app-bar-control': ProfileBadge,
  },
  meta: { shell: true, requiresAuth: true },
};
