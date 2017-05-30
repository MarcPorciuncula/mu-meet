import * as firebase from 'firebase';

let config;
if (process.env.STAGING) {
  config = {
    apiKey: 'AIzaSyA83Etthyg-GeWl6gszcyuHOSa8Tz1XkW8',
    authDomain: 'mumeet-staging.firebaseapp.com',
    databaseURL: 'https://mumeet-staging.firebaseio.com',
    projectId: 'mumeet-staging',
    storageBucket: 'mumeet-staging.appspot.com',
    messagingSenderId: '141948419718',
  };
} else {
  config = {
    apiKey: 'AIzaSyAgq_qbft78WR_bXEyiQl7z2fSInz4fBZE',
    authDomain: 'meetingsync-f62e3.firebaseapp.com',
    databaseURL: 'https://meetingsync-f62e3.firebaseio.com',
    projectId: 'meetingsync-f62e3',
    storageBucket: 'meetingsync-f62e3.appspot.com',
    messagingSenderId: '569083161786',
  };
}

firebase.initializeApp(config);

export { config };
