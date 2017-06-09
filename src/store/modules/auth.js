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
    uid: null,
  },
  mutations: {
    updateAuthStatus,
  },
  actions: {
    signIn,
    signOut,
    refreshAuthStatus,
  },
  getters: {
    authUid: getAuthUid,
  },
};

function updateAuthStatus(state, data) {
  Object.assign(state, R.pick(['pending', 'isSignedIn', 'uid'], data));
}

function getAuthUid(state) {
  return state.uid;
}

async function signIn({ commit, dispatch, state }) {
  commit('updateAuthStatus', {
    pending: PENDING_SIGN_IN,
  });
  dispatch('addProgressItem', {
    id: 'auth/sign-in',
    message: 'Signing in (Step 1/3)',
  });

  const google = await getGoogle();
  const { code } = await google.auth2
    .getAuthInstance()
    .grantOfflineAccess({ scope: SCOPE });

  dispatch('updateProgressItem', {
    id: 'auth/sign-in',
    message: 'Signing in (Step 2/3)',
  });
  const { data } = await functions('getGoogleOAuth2Authorization', {
    data: { code, redirect_uri: location.origin },
  });
  const credential = firebase.auth.GoogleAuthProvider.credential(data.id_token);
  await firebase.auth().signInWithCredential(credential);

  dispatch('updateProgressItem', {
    id: 'auth/sign-in',
    message: 'Signing in (Step 3/3)',
  });
  await functions('linkGoogleOAuthToFirebaseUser', {
    data: { credential_link_code: data.credential_link_code },
  });

  commit('updateAuthStatus', {
    pending: false,
    isSignedIn: true,
    uid: firebase.auth().currentUser.uid,
  });
  dispatch('removeProgressItem', 'auth/sign-in');
}

async function refreshAuthStatus({ commit, dispatch, state }) {
  commit('updateAuthStatus', {
    pending: PENDING_REFRESH,
  });
  dispatch('addProgressItem', {
    id: 'auth/refresh',
    message: 'Checking auth status',
  });

  await new Promise(resolve => {
    const dispose = firebase.auth().onAuthStateChanged(user => {
      const isSignedIn = !!user;

      commit('updateAuthStatus', {
        isSignedIn,
        uid: user ? user.uid : null,
        pending: false,
      });
      dispose();
      resolve();
    });
  });
  dispatch('removeProgressItem', 'auth/refresh');
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
    uid: null,
  });
}
