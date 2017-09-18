// @flow
import firebase from './firebase';
import FirebaseAuth from 'firebase/auth';
import Functions, { AUTHORIZE, LINK_AUTH } from './functions';
import getGoogle, { SCOPES } from './google';

export default {
  user: () => {
    // Force refresh of auth state by retrieving via onAuthStateChanged, always fires at
    // least once after being listened.
    return new Promise(resolve => {
      const unlisten = firebase.auth().onAuthStateChanged(user => {
        unlisten();
        resolve(user);
      });
    });
  },
  login: async () => {
    const Google = await getGoogle();

    // 1. Obtain OAuth2 authorization code from Google
    const { code } = await Google.auth2
      .getAuthInstance()
      .grantOfflineAccess({ scope: SCOPES });

    // 2. Claim authorization code server side, and retrieve a Google Identity Token
    const { data: res } = await Functions.call(AUTHORIZE, {
      data: { code, redirect_uri: location.origin },
    });

    // 3. Use Google Identity Token to sign into Firebase
    const credential = FirebaseAuth.GoogleAuthProvider.credential(res.id_token);
    await firebase.auth().signInWithCredential(credential);

    // 4. Tell the server to link the current Firebase user and the claimed Google authorization
    await Functions.call(LINK_AUTH, {
      data: { credential_link_code: res.credential_link_code },
    });
  },
  logout: () => firebase.auth().signOut(),
};
