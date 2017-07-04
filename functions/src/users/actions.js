import a from 'awaiting';
import * as admin from 'firebase-admin';
import { fetchUserProfile } from './google-profile';
import { fetchCalendars } from '../calendar/google-calendar';
import { getOAuth2Client, revoke } from '../auth/google-oauth';

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
  const user = database.ref(`/users/${event.data.uid}`);
  await user.child(`calendars`).set(calendars);

  for (let calendar of calendars) {
    let select = false;
    if (calendar.summary.toLowerCase().match(/timetable/)) {
      console.log('Found a calendar named `timetable`, marking it as selected');
      select = true;
    } else if (calendar.primary) {
      console.log('Found the primary calendar, marking it as selected');
      select = true;
    }

    if (select) {
      await user.child(`selected-calendars/${encodeId(calendar.id)}`).set(true);
    }
  }

  save();
}

export async function revokeUserAccessTokens(event) {
  const database = admin.database();
  const { uid } = event.data;

  console.log(`Revoke Google OAuth access tokens for user ${uid}`);
  const tokensRef = database.ref(`/users/${uid}/tokens`);
  const tokens = await tokensRef.once('value').then(s => s.val());

  await revoke(tokens.refresh_token);

  await tokensRef.set(null);
}

export async function deleteUserData(event) {
  const database = admin.database();
  const { uid } = event.data;

  console.log(`Remove user ${uid} data.`);

  // TODO clean up sessions etc.
  await database.ref(`/users/${uid}`).set(null);
}

function encodeId(id) {
  return Buffer.from(id).toString('base64');
}
