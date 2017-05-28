import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import cors from '../cors';
import * as middleware from './middleware';
import { validateFirebaseIdToken } from '../auth/middleware';

export const createSession = functions.https.onRequest(
  compose([cors, validateFirebaseIdToken, middleware.createSession]),
);

export const findMeetingTimes = functions.https.onRequest(
  compose([cors, validateFirebaseIdToken, middleware.findMeetingTimes]),
);
