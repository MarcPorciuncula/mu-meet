import SelectCalendars from '@/components/SelectCalendars';

export default {
  path: '/calendars',
  name: 'SelectCalendars',
  component: SelectCalendars,
  meta: { shell: true, requiresAuth: true },
};
