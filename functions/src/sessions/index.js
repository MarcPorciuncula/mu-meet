import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import bodyParser from 'body-parser';
import cors from '../cors';
import * as middleware from './middleware';
import { invalidateSessionResult } from './actions';
import { validateFirebaseIdToken } from '../auth/middleware';

export const createSession = functions.https.onRequest(
  compose([
    cors,
    bodyParser.json(),
    validateFirebaseIdToken,
    middleware.createSession,
  ]),
);

export const findMeetingTimes = functions.https.onRequest(
  compose([cors, validateFirebaseIdToken, middleware.findMeetingTimes]),
);

export const invalidateSessionResultOnConfigChange = functions.database
  .ref('/sessions/{sessionId}/config')
  .onUpdate(invalidateSessionResult);

export const invalidateSessionResultOnUserJoin = functions.database
  .ref('/sessions/{sessionId}/users/{userId}')
  .onCreate(invalidateSessionResult);
