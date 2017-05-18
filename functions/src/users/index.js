import * as functions from 'firebase-functions';
import {
  fetchProfileIntoDatabase,
  fetchCalendarsIntoDatabase,
} from './actions';

export const onUserCreateFetchProfile = functions.auth
  .user()
  .onCreate(fetchProfileIntoDatabase);

export const onUserCreateFetchCalendars = functions.auth
  .user()
  .onCreate(fetchCalendarsIntoDatabase);
