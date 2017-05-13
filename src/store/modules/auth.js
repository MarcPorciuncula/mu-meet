import * as firebase from 'firebase';
import R from 'ramda';
import getGoogle, { SCOPE } from '@/gapi';
import { functions } from '@/functions';

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
    updateAuthUser,
    updateAuthStatus,
  },
  actions: {
    signIn,
    signOut,
    refreshAuthStatus,
  },
};

function updateAuthUser(state, data) {
  if (data === null) {
    state.user = {};
  } else {
    Object.assign(
      state.user,
      R.pick(['email', 'displayName', 'photoURL', 'uid', 'token'], data),
    );
  }
}

function updateAuthStatus(state, data) {
  Object.assign(state, R.pick(['pending', 'isSignedIn'], data));
}

async function signIn({ commit, state }) {
  commit('updateAuthStatus', {
    pending: PENDING_SIGN_IN,
  });
  const google = await getGoogle();
  const { code } = await google.auth2
    .getAuthInstance()
    .grantOfflineAccess({ scope: SCOPE });
  const { data } = await functions('getGoogleOAuth2Authorization', {
    data: { code },
  });
  const credential = firebase.auth.GoogleAuthProvider.credential(data.id_token);
  await firebase.auth().signInWithCredential(credential);
  await functions('linkGoogleOAuthToFirebaseUser', {
    data: { credential_link_code: data.credential_link_code },
  });
  commit('updateAuthStatus', {
    pending: false,
    isSignedIn: true,
  });
  commit('updateAuthUser', firebase.auth().currentUser);
}

async function refreshAuthStatus({ commit, state }) {
  commit('updateAuthStatus', {
    pending: PENDING_REFRESH,
  });

  const user = firebase.auth().currentUser;
  const isSignedIn = !!firebase.auth().currentUser;
  commit('updateAuthStatus', {
    isSignedIn,
    pending: false,
  });
  commit('updateAuthUser', user);
}

async function signOut({ commit, state }) {
  commit('updateAuthStatus', {
    isSignedIn: state.isSignedIn,
    pending: PENDING_SIGN_OUT,
  });

  await firebase.auth().signOut();
  commit('updateAuthStatus', {
    isSignedIn: false,
    pending: false,
  });
  commit('updateAuthUser', null);
}
