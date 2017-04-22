import R from 'ramda';
import getGoogle from '@/gapi';

export default {
  state: {
    calendars: [],
  },
  mutations: {
    updateCalendars(state, calendars) {
      state.calendars = calendars;
    },
  },
  actions: {
    async getCalendars({ commit }) {
      const google = await getGoogle();
      const response = await google.client.calendar.calendarList.list();
      const body = JSON.parse(response.body);

      let calendars = R.filter(item =>
        item.id.match(/@import\.calendar\.google\.com$/),
      )(body.items);

      commit('updateCalendars', calendars);
    },
  },
};
