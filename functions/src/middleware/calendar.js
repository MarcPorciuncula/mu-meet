import * as admin from 'firebase-admin';
import parse from 'date-fns/parse';
import R from 'ramda';
import { fetchCalendars, fetchEvents } from '../lib/google-calendar';

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

export async function getEvents(req, res) {
  const database = admin.database();
  const { uid } = res.locals.idToken;
  const { oAuth2Client } = res.locals;

  const { from, to } = R.evolve({ from: parse, to: parse })(req.body);

  const calendarIds = await database
    .ref(`/users/${uid}/selected-calendars`)
    .once('value')
    .then(s => s.val())
    .then(R.compose(R.map(atob), R.keys, R.pickBy(R.identity)));

  const allEvents = [];
  for (const calendarId of calendarIds) {
    const events = await fetchEvents(uid, oAuth2Client, {
      from,
      to,
      calendarId,
    });
    allEvents.push(
      ...events.map(event => Object.assign({}, event, { calendarId })),
    );
  }

  res.type('application/json');
  res.status(200).send(JSON.stringify(allEvents));
}

function atob(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}
