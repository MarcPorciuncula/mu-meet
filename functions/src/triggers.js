/* eslint-disable camelcase */

import * as functions from 'firebase-functions';
import { compose } from 'compose-middleware';
import * as middleware from './middleware';
import * as actions from './actions';

const { cors, validateFirebaseIdToken, withOAuth2Client, json } = middleware;

export const get_google_oauth2_authorization = functions.https.onRequest(
  compose([cors, json, middleware.getGoogleOAuth2Authorization]),
);

export const link_google_oauth_to_firebase_user = functions.https.onRequest(
  compose([
    cors,
    middleware.validateFirebaseIdToken,
    json,
    middleware.linkGoogleOAuthToFirebaseUser,
  ]),
);

export const get_calendars = functions.https.onRequest(
  compose([
    cors,
    validateFirebaseIdToken,
    withOAuth2Client,
    middleware.getCalendars,
  ]),
);

export const get_events = functions.https.onRequest(
  compose([
    cors,
    json,
    validateFirebaseIdToken,
    withOAuth2Client,
    middleware.getEvents,
  ]),
);

export const create_session = functions.https.onRequest(
  compose([
    cors,
    json,
    validateFirebaseIdToken,
    middleware.createSession,
  ]),
);

export const find_meeting_times = functions.https.onRequest(
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

export const delete_old_sessions = functions.https.onRequest(async (req, res) => {
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
