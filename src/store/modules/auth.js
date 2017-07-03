import * as firebase from 'firebase';
import getGoogle, { SCOPE } from '@/gapi';
import { functions } from '@/functions';
import { UPDATE_AUTH_STATE } from '@/store/mutations';
import { REFRESH_AUTH_STATUS, SIGN_IN, SIGN_OUT } from '@/store/actions';
import { USER_UID, IS_SIGNED_IN, SIGN_IN_PENDING } from '@/store/getters';

const PENDING_INITIAL_REFRESH = 'PENDING_INITIAL_REFRESH';
const PENDING_SIGN_IN = 'PENDING_SIGN_IN';
const PENDING_SIGN_OUT = 'PENDING_SIGN_OUT';
const PENDING_REFRESH = 'PENDING_REFRESH';

const state = {
  uid: null,
  pending: PENDING_INITIAL_REFRESH,
};

const mutations = {
  [UPDATE_AUTH_STATE](state, data) {
    Object.assign(state, data);
  },
};

const actions = {
  async [REFRESH_AUTH_STATUS]({ commit }) {
    commit(UPDATE_AUTH_STATE, { pending: PENDING_REFRESH });

    const user = await once(
      firebase.auth().onAuthStateChanged.bind(firebase.auth()),
    );

    commit(UPDATE_AUTH_STATE, {
      uid: user ? user.uid : null,
      pending: null,
    });
  },
  async [SIGN_IN]({ commit, dispatch }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_IN,
    });
    dispatch('addProgressItem', {
      id: SIGN_IN,
      message: 'Signing in (Step 1/3)',
    });

    const google = await getGoogle();
    const { code } = await google.auth2
      .getAuthInstance()
      .grantOfflineAccess({ scope: SCOPE });

    dispatch('updateProgressItem', {
      id: SIGN_IN,
      message: 'Signing in (Step 2/3)',
    });
    const { data } = await functions('getGoogleOAuth2Authorization', {
      data: { code, redirect_uri: location.origin },
    });
    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.id_token,
    );
    await firebase.auth().signInWithCredential(credential);

    dispatch('updateProgressItem', {
      id: SIGN_IN,
      message: 'Signing in (Step 3/3)',
    });
    await functions('linkGoogleOAuthToFirebaseUser', {
      data: { credential_link_code: data.credential_link_code },
    });

    commit(UPDATE_AUTH_STATE, {
      uid: firebase.auth().currentUser.uid,
      pending: null,
    });
    dispatch('removeProgressItem', SIGN_IN);
  },
  async [SIGN_OUT]({ commit }) {
    commit(UPDATE_AUTH_STATE, {
      pending: PENDING_SIGN_OUT,
    });

    await firebase.auth().signOut();

    commit(UPDATE_AUTH_STATE, {
      uid: null,
      pending: null,
    });
  },
};

const getters = {
  [USER_UID](state) {
    return state.uid;
  },
  [IS_SIGNED_IN](state, getters) {
    if (state.pending === PENDING_INITIAL_REFRESH) {
      return null;
    }
    return !!getters[USER_UID];
  },
  [SIGN_IN_PENDING](state) {
    return !!state.pending;
  },
};

export default {
  state,
  mutations,
  actions,
  getters: {
    ...getters,
  },
};

function once(listen) {
  return new Promise(resolve => {
    const unlisten = listen(value => {
      unlisten();
      resolve(value);
    });
  });
}
