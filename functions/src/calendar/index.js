import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import bodyParser from 'body-parser';
import { withOAuth2Client, validateFirebaseIdToken } from '../auth/middleware';
import cors from '../cors';
import * as middleware from './middleware';

export const getCalendars = functions.https.onRequest(
  compose([
    cors,
    validateFirebaseIdToken,
    withOAuth2Client,
    middleware.getCalendars,
  ]),
);

export const getEvents = functions.https.onRequest(
  compose([
    cors,
    bodyParser.json(),
    validateFirebaseIdToken,
    withOAuth2Client,
    middleware.getEvents,
  ]),
);
