import a from 'awaiting';
import * as admin from 'firebase-admin';
import { fetchUserProfile } from './google-profile';
import { fetchCalendars } from '../calendar/google-calendar';
import { getOAuth2Client } from '../auth/google-oauth';

export async function fetchProfileIntoDatabase(event) {
  const database = admin.database();
  const { oAuth2Client, save } = await getOAuth2Client(event.data.uid);

  const profile = await fetchUserProfile(event.data.uid, oAuth2Client);
  await a.list(
    ['email', 'name', 'given_name', 'family_name', 'picture'].map(prop =>
      database
        .ref(`/users/${event.data.uid}/profile/${prop}`)
        .set(profile[prop]),
    ),
  );

  save();
}

export async function fetchCalendarsIntoDatabase(event) {
  const database = admin.database();
  const { oAuth2Client, save } = await getOAuth2Client(event.data.uid);

  console.log(
    `User ${event.data.uid} created. Fetch calendars and place in database`,
  );

  const calendars = await fetchCalendars(event.data.uid, oAuth2Client);
  await database.ref(`/users/${event.data.uid}/calendars`).set(calendars);

  save();
}
