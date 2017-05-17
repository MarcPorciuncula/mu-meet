import a from 'awaiting';
import google from 'googleapis';
import { getOAuth2Client } from '../auth/google-oauth';

/**
 * Fetches the calendars for user uid and places it onto /users/$uid/calendars
 * @param  {string} uid the user's uid
 * @param  {OAuth2Client} oAuth2Client the Google API OAuth2 client for the user, if known
 */
export async function fetchCalendars(uid, oAuth2Client) {
  let save;
  if (!oAuth2Client) {
    ({ oAuth2Client, save } = await getOAuth2Client(uid));
  }
  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client,
  });
  const data = await a.callback(cb => calendar.calendarList.list(cb));

  if (save) {
    save();
  }
  return data.items;
}
