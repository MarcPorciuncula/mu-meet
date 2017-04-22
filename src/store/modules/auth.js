import * as firebase from 'firebase';
import R from 'ramda';
import getGoogle from '@/gapi';

export default {
  state: {
    isSignedIn: null,
    user: {},
  },
  mutations: {
    updateSigninStatus(state, data) {
      if (data) {
        Object.assign(state.user, data);
        state.isSignedIn = true;
      } else {
        state.user = {};
        state.isSignedIn = false;
      }
    },
  },
  actions: {
    async refreshSignInStatus({ commit }) {
      const google = await getGoogle();

      console.log('Refreshing signin status');

      const isSignedIn = google.auth2.getAuthInstance().isSignedIn.get();
      const user = firebase.auth().currentUser;
      if (isSignedIn && user) {
        console.log('Currently signed in');
        commit(
          'updateSigninStatus',
          R.pick(['email', 'displayName', 'photoURL', 'uid'], user),
        );
      } else {
        console.log('Not currently signed in');
        commit('updateSigninStatus', null);
      }
    },
    async signIn({ commit }) {
      const google = await getGoogle();
      const database = firebase.database();

      return new Promise(resolve => {
        const listener = google.auth2
          .getAuthInstance()
          .isSignedIn.listen(async isSignedIn => {
            if (!isSignedIn) {
              return;
            }
            console.log('Signed in to google');
            const credential = firebase.auth.GoogleAuthProvider.credential(
              google.auth2.getAuthInstance().currentUser.get().getAuthResponse()
                .id_token,
            );
            const user = await firebase.auth().signInWithCredential(credential);
            console.log('Signed in to firebase');
            commit(
              'updateSigninStatus',
              R.pick(['email', 'displayName', 'photoURL', 'uid'], user),
            );
            database
              .ref(`/users/${user.uid}`)
              .set(R.pick(['email', 'displayName', 'photoURL', 'uid'], user));
            listener.remove();
            resolve();
          });
        google.auth2.getAuthInstance().signIn();
      });
    },
    async signOut({ commit }) {
      const google = await getGoogle();

      return new Promise(resolve => {
        const listener = google.auth2
          .getAuthInstance()
          .isSignedIn.listen(async isSignedIn => {
            if (isSignedIn) {
              return;
            }

            await firebase.auth().signOut();
            commit('updateSigninStatus', null);
            listener.remove();
            resolve();
          });

        google.auth2.getAuthInstance().signOut();
      });
    },
  },
};
