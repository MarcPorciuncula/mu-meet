import * as firebase from 'firebase';
import config from '../secret/firebase-config.json';

firebase.initializeApp(config);

export { config };
