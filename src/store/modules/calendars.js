import Vue from 'vue';
import * as firebase from 'firebase';

const state = {};

function updateCalendar(state, calendar) {
  Vue.set(state, encodeId(calendar.id), calendar);
  if (typeof state[encodeId(calendar.id)].selected === 'undefined') {
    state[encodeId(calendar.id)].selected = false;
  }
}

function _updateCalendarSelected(state, { id, selected }) {
  state[encodeId(id)].selected = selected;
}

async function fetchCalendars({ commit, dispatch, state, rootState }) {
  dispatch('addProgressItem', {
    id: 'calendars/fetch',
    message: 'Fetching your calendars',
  });
  const database = firebase.database();
  const userRef = database.ref(`/users/${rootState.auth.uid}`);

  const calendars = await userRef
    .child('calendars')
    .once('value')
    .then(s => s.val());
  const selected = await userRef
    .child('selected-calendars')
    .once('value')
    .then(s => s.val());

  for (const calendar of calendars) {
    commit('updateCalendar', calendar);
    commit('updateCalendarSelected', {
      id: calendar.id,
      selected: !!selected[encodeId(calendar.id)],
    });
  }
  dispatch('removeProgressItem', 'calendars/fetch');
}

async function updateCalendarSelected(
  { commit, state, rootState },
  { id, selected },
) {
  const database = firebase.database();

  await database
    .ref(`/users/${rootState.auth.uid}/selected-calendars/${encodeId(id)}`)
    .set(selected);
  commit('updateCalendarSelected', { id, selected });
}

function encodeId(id) {
  return btoa(id);
}

// function decodeId(id) {
//   return atob(id);
// }

export default {
  state,
  mutations: {
    updateCalendar,
    updateCalendarSelected: _updateCalendarSelected,
  },
  actions: {
    fetchCalendars,
    updateCalendarSelected,
  },
};
