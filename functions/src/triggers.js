/* eslint-disable camelcase */

import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import bodyParser from 'body-parser';
import * as middleware from './middleware';
import * as actions from './actions';

const { cors, validateFirebaseIdToken, withOAuth2Client } = middleware;

export const getGoogleOAuth2Authorization = functions.https.onRequest(
  compose([cors, bodyParser.json(), middleware.getGoogleOAuth2Authorization]),
);

export const linkGoogleOAuthToFirebaseUser = functions.https.onRequest(
  compose([
    cors,
    middleware.validateFirebaseIdToken,
    bodyParser.json(),
    middleware.linkGoogleOAuthToFirebaseUser,
  ]),
);

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
  .onUpdate(actions.invalidateSessionResult);

export const invalidateSessionResultOnUserJoin = functions.database
  .ref('/sessions/{sessionId}/users/{userId}')
  .onCreate(actions.invalidateSessionResult);

export const onUserCreate = functions.auth
  .user()
  .onCreate(async event =>
    Promise.all([
      actions.fetchProfileIntoDatabase(event),
      actions.fetchCalendarsIntoDatabase(event),
    ]),
  );

export const onUserDeleteCleanUp = functions.auth
  .user()
  .onDelete(async event => {
    try {
      await actions.revokeUserAccessTokens(event);
    } finally {
      await actions.deleteUserData(event);
    }
  });

export const deleteOldSessions = functions.https.onRequest(async (req, res) => {
  await actions.deleteOldSessions();
  res.status(200).send('OK');
});

export const refetch_profiles = functions.https.onRequest(async (req, res) => {
  await actions.refetchProfiles();
  res.status(200).send('OK');
});

export const validate_users = functions.https.onRequest(async (req, res) => {
  await actions.validateUsers();
  res.status(200).send('OK');
});
