import * as firebase from 'firebase';
import shortid from 'shortid';
import R from 'ramda';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import parseDate from 'date-fns/parse';
import isSaturday from 'date-fns/is_saturday';
import isSunday from 'date-fns/is_sunday';
import a from 'awaiting';
import {
  getFreeHalfHourIntervals,
  restrictHours,
  groupIntervals,
  sortByDistanceFrom1PM,
} from '@/scheduler';
import getGoogle from '@/gapi';

export const SELECT_CALENDARS = 'SELECT_CALENDARS';
export const WAIT = 'WAIT';

let disposeSessionDataListener;

let currentProcess = null;

export default {
  state: {
    isInSession: false,
    id: null,
    events: [],
    phase: null,
    host: null,
    isHost: false,
    users: [],
    computing: false,
    meetings: null,
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
    updateAllEvents(state, data) {
      state.events = data;
    },
    updatePhase(state, phase) {
      state.phase = phase;
    },
  },
  actions: {
    async refreshSessionStatus({ commit, rootState }) {
      const database = firebase.database();
      const snapshot = await database
        .ref(`/users/${rootState.auth.user.uid}/session`)
        .once('value');
      const sessionId = snapshot.val();
      console.log('The session id is', sessionId);
      if (sessionId) {
        commit('updateSessionStatus', { id: sessionId });
      } else {
        commit('updateSessionStatus', null);
      }
    },
    async subscribeSessionStatus({ commit, rootState }) {
      const database = firebase.database();
      const snapshot = await database
        .ref(`/users/${rootState.auth.user.uid}/session`)
        .once('value');
      const sessionId = snapshot.val();
      console.log('The session is', sessionId);
      if (sessionId) {
        commit('updateSessionStatus', { id: sessionId });
      } else {
        commit('updateSessionStatus', null);
        return;
      }
      if (disposeSessionDataListener) {
        console.log('the listener is', disposeSessionDataListener);
        disposeSessionDataListener();
      }
      disposeSessionDataListener = database
        .ref(`/sessions/${sessionId}`)
        .on('value', async snapshot => {
          if (currentProcess) {
            await currentProcess;
          }
          currentProcess = (async () => {
            const sessionData = snapshot.val();
            console.log(
              'the session changed',
              JSON.parse(JSON.stringify(sessionData)),
            );
            const users = sessionData.users;
            const usersDataSnapshots = await a.object(
              R.mapObjIndexed(
                (data, key) => database.ref(`/users/${key}`).once('value'),
                users,
              ),
            );

            for (let uid in users) {
              users[uid].data = usersDataSnapshots[uid].val();
            }

            console.log('my phase is', users[rootState.auth.user.uid].phase);

            commit('updateSessionStatus', {
              isHost: sessionData.host === rootState.auth.user.uid,
              phase: users[rootState.auth.user.uid].phase,
              users,
              host: sessionData.host,
              computing: sessionData.computing || false,
              meetings: sessionData.meetings,
            });
          })();
        });
    },
    async createSession({ commit }) {
      const database = firebase.database();

      const sessionsRef = database.ref('/sessions');
      const id = shortid.generate();
      const sessionRef = sessionsRef.child(id);

      sessionRef.child('host').set(firebase.auth().currentUser.uid);
      sessionRef
        .child(`/users/${firebase.auth().currentUser.uid}`)
        .set({ phase: SELECT_CALENDARS });

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
        .set({ phase: SELECT_CALENDARS });
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
            timeMin: getStartOfWeek(new Date()).toISOString(),
            timeMax: getEndOfWeek(new Date()).toISOString(),
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
      await a.delay(1000);
      database
        .ref(`/sessions/${state.id}/users/${rootState.auth.user.uid}/phase`)
        .set(WAIT);
      commit('updateSessionStatus', {
        phase: WAIT,
      });
    },
    async generateFreeTimes({ commit, state }) {
      const database = firebase.database();
      database.ref(`/sessions/${state.id}/computing`).set(true);
      const users = (await database
        .ref(`/sessions/${state.id}/users`)
        .once('value')).val();

      console.log(users);

      const events = R.compose(
        R.map(event => ({
          start: parseDate(event.start.dateTime),
          end: parseDate(event.end.dateTime),
        })),
        R.filter(R.identity),
        R.flatten,
        R.map(user => user.events),
        R.map(R.defaultTo({ events: [] })),
        R.values,
      )(users);

      commit('updateAllEvents', events);

      let freeIntervals = R.compose(
        R.sort((a, b) => sortByDistanceFrom1PM(a.start, b.start)),
        arr => {
          console.log(arr);
          return arr;
        },
        groupIntervals,
        R.filter(R.complement(isSaturday)),
        R.filter(R.complement(isSunday)),
        R.filter(restrictHours(8, 21.5)),
        getFreeHalfHourIntervals,
      )(events);

      database.ref(`/sessions/${state.id}/meetings`).set(
        freeIntervals.map(({ start, duration }) => ({
          start: start.toISOString(),
          duration,
        })),
      );
      console.log(
        freeIntervals.map(({ start, duration }) => ({
          start: start.toISOString(),
          duration,
        })),
      );

      await a.delay(1000);

      database.ref(`/sessions/${state.id}/computing`).set(false);
    },
  },
};
