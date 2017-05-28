import * as firebase from 'firebase';
import getGoogle from '@/gapi';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import invariant from 'invariant';
import R from 'ramda';
import { functions } from '@/functions';

export default {
  state: {
    calendars: [],
    selected: null,
    events: [],
  },
  mutations: {
    updateCalendars,
    updateSelectedCalendars,
    updateEvents,
  },
  actions: {
    fetchCalendars,
    fetchCalendarEvents,
    uploadSelectedCalendars,
  },
};

function updateCalendars(state, calendars) {
  state.calendars = calendars;
}

function updateSelectedCalendars(state, selected) {
  state.selected = selected;
}

function updateEvents(state, events) {
  state.events = events;
}

async function fetchCalendars({ commit, rootState }) {
  if (!rootState.auth.isSignedIn) {
    throw new Error('Cannot fetch calendars when not logged in');
  }
  await functions('getCalendars');
  const calendarsSnapshot = await firebase
    .database()
    .ref(`/users/${rootState.auth.uid}/calendars`)
    .once('value');
  const calendars = calendarsSnapshot.val();
  commit('updateCalendars', calendars);

  const database = firebase.database();
  const snapshot = await database
    .ref(`/users/${rootState.auth.uid}/selected-calendars`)
    .once('value');
  const selectedCalendars = snapshot.val();
  if (selectedCalendars) {
    const decoded = R.compose(
      R.fromPairs,
      R.map(([encodedId, isSelected]) => [atob(encodedId), isSelected]),
      R.toPairs,
    )(selectedCalendars);
    commit('updateSelectedCalendars', decoded);
  }
}

async function uploadSelectedCalendars({ commit, rootState }, selected) {
  commit('updateSelectedCalendars', selected);
  invariant(
    rootState.auth.isSignedIn,
    'Must be signed in to call uploadSelectedCalendars',
  );
  const database = firebase.database();
  const encoded = R.compose(
    R.fromPairs,
    R.map(([id, isSelected]) => [btoa(id), isSelected]),
    R.toPairs,
  )(selected);
  const userRef = database.ref(`/users/${rootState.auth.uid}`);
  userRef.child('selected-calendars').set(encoded);
}

async function fetchCalendarEvents({ commit, state, rootState }) {
  if (!rootState.auth.isSignedIn) {
    throw new Error('Cannot fetch calendar events when not logged in');
  }

  const google = await getGoogle();
  const responses = await Promise.all(
    state.calendars.filter(({ id }) => state.selected[id]).map(({ id }) =>
      google.client.calendar.events
        .list({
          calendarId: id,
          // TODO get the timeMin and timeMax from the session config
          timeMin: getStartOfWeek(new Date()).toISOString(),
          timeMax: getEndOfWeek(new Date()).toISOString(),
          orderBy: 'startTime',
          showDeleted: false,
          singleEvents: true,
        })
        .then(R.prop('body'))
        .then(JSON.parse),
    ),
  );
  const events = R.flatten(responses.map(response => response.items));
  commit('updateEvents', events);
}
