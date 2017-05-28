import * as admin from 'firebase-admin';
import { fetchCalendars } from './google-calendar';

/**
 * Fetches the current Firebase User's calendar list and places it under their user entry in the database
 * @param  {ExpressRequest} req
 * @param  {ExpressResponse} res
 * @param  {string} res.locals.idToken.uid The user's firebase uid
 */
export async function getCalendars(req, res) {
  const database = admin.database();
  const { uid } = res.locals.idToken;
  const { oAuth2Client } = res.locals;

  const calendars = await fetchCalendars(uid, oAuth2Client);

  await database.ref(`/users/${uid}/calendars`).set(calendars);
  res.send(200, 'OK');
}
