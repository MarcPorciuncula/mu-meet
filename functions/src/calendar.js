import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import google from 'googleapis';
import { compose } from 'compose-middleware';
import a from 'awaiting';
import cors from './cors';
import { validateFirebaseIdToken, withOAuth2Client } from './auth';

/**
 * Fetches the current Firebase User's calendar list and places it under their user entry in the database
 * @param  {ExpressRequest} req
 * @param  {ExpressResponse} res
 * @param  {string} res.locals.idToken.uid The user's firebase uid
 */
async function _getCalendars(req, res) {
  const database = admin.database();
  const { uid } = res.locals.idToken;
  const { oAuth2Client } = res.locals;

  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client,
  });
  const data = await a.callback(calendar.calendarList.list.bind(calendar));

  await database.ref(`/users/${uid}/calendars`).set(data.items);
  res.send(200, 'OK');
}

export const getCalendars = functions.https.onRequest(
  compose([cors, validateFirebaseIdToken, withOAuth2Client, _getCalendars]),
);
