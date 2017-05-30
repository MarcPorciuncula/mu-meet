import * as functions from 'firebase-functions';
import {
  fetchProfileIntoDatabase,
  fetchCalendarsIntoDatabase,
  revokeUserAccessTokens,
  deleteUserData,
} from './actions';

export const onUserCreate = functions.auth.user().onCreate(async event => {
  await Promise.all([
    fetchProfileIntoDatabase(event),
    fetchCalendarsIntoDatabase(event),
  ]);
});

export const onUserDeleteCleanUp = functions.auth
  .user()
  .onDelete(async event => {
    try {
      await revokeUserAccessTokens(event);
    } finally {
      await deleteUserData(event);
    }
  });
