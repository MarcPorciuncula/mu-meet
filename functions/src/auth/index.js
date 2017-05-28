import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import cors from '../cors';
import bodyParser from 'body-parser';
import * as middleware from './middleware';

export const getGoogleOAuth2Authorization = functions.https.onRequest(
  compose([cors, bodyParser.json(), middleware.getGoogleOAuth2Authorization])
);

export const linkGoogleOAuthToFirebaseUser = functions.https.onRequest(
  compose([
    cors,
    middleware.validateFirebaseIdToken,
    bodyParser.json(),
    middleware.linkGoogleOAuthToFirebaseUser,
  ])
);
