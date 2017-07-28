// @flow
import { Observable } from 'rxjs-es/Observable';
import firebase from '@/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import getGoogle, { SCOPE } from '@/gapi';
import { call } from './cloud-functions';

const auth = firebase.auth();

export async function getIsAuthenticated() {
  const user = once(auth.onAuthStateChanged.bind(auth));
  return !!user;
}

export async function getCurrentUserUid() {
  return auth.currentUser && auth.currentUser.uid;
}

export function signInWithProgress() {
  return Observable.create(observer => {
    (async () => {
      const google = await getGoogle();

      observer.next(1);

      const { code } = await google.auth2
        .getAuthInstance()
        .grantOfflineAccess({ scope: SCOPE });

      observer.next(2);

      const { data } = await call('getGoogleOAuth2Authorization', {
        data: { code, redirect_uri: location.origin },
      });

      observer.next(3);

      const credential = GoogleAuthProvider.credential(data.id_token);
      await auth.signInWithCredential(credential);

      observer.next(4);

      await call('linkGoogleOauthToFirebaseUser', {
        data: { credential_link_code: data.credential_link_code },
      });

      observer.complete();
    })().catch(err => observer.error(err));
  });
}

export function signOut() {
  return firebase.auth().signOut();
}

function once(listen) {
  return new Promise(resolve => {
    const unlisten = listen(value => {
      unlisten();
      resolve(value);
    });
  });
}
