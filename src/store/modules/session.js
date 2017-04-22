import * as firebase from 'firebase';
import shortid from 'shortid';
import R from 'ramda';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import getGoogle from '@/gapi';

export default {
  state: {
    isInSession: false,
    id: null,
    events: [],
  },
  mutations: {
    updateSessionStatus(state, data) {
      if (data) {
        state.isInSession = true;
        Object.assign(state, data);
      } else {
        state.isInSession = false;
      }
    },
    updateEvents(state, data) {
      state.events = data;
    },
  },
  actions: {
    async createSession({ commit }) {
      const database = firebase.database();

      const sessionsRef = database.ref('/sessions');
      const id = shortid.generate();
      const sessionRef = sessionsRef.child(id);

      sessionRef.child('host').set(firebase.auth().currentUser.uid);
      sessionRef
        .child(`/users/${firebase.auth().currentUser.uid}`)
        .set({ pending: true });

      const userRef = database.ref(`/users/${firebase.auth().currentUser.uid}`);
      userRef.child('session').set(id);
      commit('updateSessionStatus', {
        id: sessionRef.key,
      });
    },
    async joinSession({ commit, rootState }, id) {
      const database = firebase.database();

      const sessionRef = database.ref(`/sessions/${id}`);
      const session = await sessionRef.once('value');
      if (!session) {
        throw new Error('no session with id: ' + id);
      }

      sessionRef
        .child(`users/${rootState.auth.user.uid}`)
        .set({ pending: true });
      const userRef = database.ref(`/users/${firebase.auth().currentUser.uid}`);
      userRef.child('session').set(id);
      commit('updateSessionStatus', {
        id: sessionRef.key,
      });
    },
    async loadCalendarEvents({ commit, state, rootState }, calendarIds) {
      const google = await getGoogle();
      const database = firebase.database();

      console.log(calendarIds);

      const responses = await Promise.all(
        calendarIds.map(id =>
          google.client.calendar.events.list({
            calendarId: id,
            timeMin: startOfWeek(new Date()).toISOString(),
            timeMax: endOfWeek(new Date()).toISOString(),
            orderBy: 'startTime',
            showDeleted: false,
            singleEvents: true,
          }),
        ),
      );
      const calendars = responses.map(response => JSON.parse(response.body));
      const events = R.flatten(calendars.map(calendar => calendar.items));

      console.log(events);

      database
        .ref(`/sessions/${state.id}/users/${rootState.auth.user.uid}/events`)
        .set(events);
    },
  },
};
