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
      commit('updateCalendars', body.items);
    },
  },
};
