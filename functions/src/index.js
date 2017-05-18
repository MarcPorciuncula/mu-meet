import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp(functions.config().firebase);
}

export { createSession } from './sessions';
export {
  getGoogleOAuth2Authorization,
  linkGoogleOAuthToFirebaseUser,
} from './auth';
export { getCalendars } from './calendar';
export { onUserCreateFetchProfile, onUserCreateFetchCalendars } from './users';
