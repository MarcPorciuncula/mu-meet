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
    fetchUsers,
  },
};

function updateUser(state, data) {
  Vue.set(state.users, data.uid, data);
}

async function fetchUsers({ commit, state }, userIds) {
  const database = firebase.database();

  const users = await Promise.all(
    userIds
      .filter(id => !state.users[id])
      .map(id =>
        database
          .ref(`/users/${id}`)
          .once('value')
          .then(snapshot => snapshot.val()),
      ),
  );
  for (const user of users) {
    commit('updateUser', user);
  }
}
