import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import google from 'googleapis';
import { compose } from 'compose-middleware';
import a from 'awaiting';
import credentials from './credentials';
import cors from './cors';
import { validateFirebaseIdToken } from './auth';

/**
 * Fetches the current Firebase User's calendar list and places it under their user entry in the database
 * @param  {ExpressRequest} req
 * @param  {ExpressResponse} res
 * @param  {string} res.locals.idToken.uid The user's firebase uid
 */
async function _getCalendars(req, res) {
  const database = admin.database();
  const { uid } = res.locals.idToken;

  const snapshot = await database.ref(`/users/${uid}/tokens`).once('value');
  const tokens = snapshot.val();
  const oauth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0],
  );
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });
  const data = await a.callback(calendar.calendarList.list.bind(calendar));

  await database.ref(`/users/${uid}/calendars`).set(data.items);
  res.send(200, 'OK');
}

export const getCalendars = functions.https.onRequest(
  compose([cors, validateFirebaseIdToken, _getCalendars]),
);
