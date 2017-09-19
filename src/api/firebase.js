import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from '../../secret/firebase-config.json';

const app = firebase.initializeApp(config);

export default app;

export { config };
