import * as firebase from 'firebase';
import R from 'ramda';
import getGoogle from '@/gapi';

export const PENDING_SIGN_IN = 'PENDING_SIGN_IN';
export const PENDING_REFRESH = 'PENDING_REFRESH';
export const PENDING_SIGN_OUT = 'PENDING_SIGN_OUT';

export default {
  state: {
    pending: false,
    isSignedIn: null,
    // TODO delegate to the users module
    user: {
      email: null,
      displayName: null,
      photoURL: null,
      uid: null,
    },
  },
  mutations: {
    updateAuthUser(state, data) {
      if (data === null) {
        state.user = {};
      } else {
        Object.assign(
          state.user,
          R.pick(['email', 'displayName', 'photoURL', 'uid'], data),
        );
      }
    },
    updateAuthStatus(state, data) {
      Object.assign(state, R.pick(['pending', 'isSignedIn'], data));
    },
  },
  actions: {
    async refreshAuthStatus({ commit, state }) {
      commit('updateAuthStatus', {
        isSignedIn: false,
        pending: PENDING_REFRESH,
      });

      const google = await getGoogle();

      const googleIsSignedIn = google.auth2.getAuthInstance().isSignedIn.get();
      const firebaseUser = firebase.auth().currentUser;

      let isSignedIn = true;
      // TODO handle when they are out of sync
      if (!googleIsSignedIn) {
        isSignedIn = false;
      }
      if (!firebaseUser) {
        isSignedIn = false;
      }

      if (isSignedIn) {
        commit('updateAuthStatus', {
          isSignedIn: true,
          pending: false,
        });
        commit(
          'updateAuthUser',
          R.pick(['email', 'displayName', 'photoURL', 'uid'], firebaseUser),
        );
      } else {
        commit('updateAuthStatus', {
          isSignedIn: false,
          pending: false,
        });
        commit('updateAuthUser', null);
      }
    },
    async handleGoogleSignin({ commit, state }) {
      const google = await getGoogle();
      const {
        id_token,
      } = google.auth2.getAuthInstance().currentUser.get().getAuthResponse();
      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      await firebase.auth().signInWithCredential(credential);
      commit('updateAuthStatus', {
        isSignedIn: true,
        pending: false,
      });
      commit(
        'updateAuthUser',
        R.pick(
          ['email', 'displayName', 'photoURL', 'uid'],
          firebase.auth().currentUser,
        ),
      );
      // Update user info in the database
      // TODO this should be done in a cloud function
      await firebase.database().ref(`/users/${state.user.uid}`).set(state.user);
    },
    async signOut({ commit, state }) {
      commit('updateAuthStatus', {
        isSignedIn: state.isSignedIn,
        pending: PENDING_SIGN_OUT,
      });
      const google = await getGoogle();

      await Promise.all([
        firebase.auth().signOut(),
        google.auth2.getAuthInstance().signOut(),
      ]);
      commit('updateAuthStatus', {
        isSignedIn: false,
        pending: false,
      });
      commit('updateAuthUser', null);
    },
  },
};
