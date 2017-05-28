import * as functions from 'firebase-functions';
import {
  fetchProfileIntoDatabase,
  fetchCalendarsIntoDatabase,
  revokeUserAccessTokens,
  deleteUserData,
} from './actions';

export const onUserCreateFetchProfile = functions.auth
  .user()
  .onCreate(fetchProfileIntoDatabase);

export const onUserCreateFetchCalendars = functions.auth
  .user()
  .onCreate(fetchCalendarsIntoDatabase);

export const onUserDeleteCleanUp = functions.auth
  .user()
  .onDelete(async event => {
    try {
      await revokeUserAccessTokens(event);
    } finally {
      await deleteUserData(event);
    }
  });
