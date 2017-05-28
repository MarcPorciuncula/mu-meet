import * as firebase from 'firebase';
import Vue from 'vue';

export default {
  state: {
    users: {},
  },
  mutations: {
    updateUser,
  },
  actions: {
    ensureUserProfile,
  },
};

function updateUser(state, { uid, user }) {
  Vue.set(state.users, uid, user);
}

async function ensureUserProfile({ commit, state }, uid) {
  if (state.users[uid]) {
    return;
  }

  const database = firebase.database();

  const profile = await database
    .ref(`/users/${uid}/profile`)
    .once('value')
    .then(snapshot => snapshot.val());

  const user = profile ? { profile } : null;

  commit('updateUser', { uid, user });
}
