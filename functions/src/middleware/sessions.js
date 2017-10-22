import {
  SessionError,
  createSession as _createSession,
  findMeetingTimes as _findMeetingTimes,
} from '../lib/sessions';
import * as admin from 'firebase-admin';

export async function createSession(req, res) {
  const { uid } = res.locals.idToken;
  const { startedAt, timezoneOffset } = req.body;

  try {
    await _createSession(uid, { startedAt, timezoneOffset });
  } catch (err) {
    if (err.code === SessionError.codes.ALREADY_IN_SESSION) {
      // FIXME find a way of notifying the user
      res.send(400, err.message);
    } else {
      res.send(504);
    }
  }

  console.log(`Created session with host ${uid}`);
  res.status(200).send('OK');
}

export async function findMeetingTimes(req, res) {
  const { uid } = res.locals.idToken;
  const database = admin.database();

  const sessionId = await database
    .ref(`/users/${uid}/current-session`)
    .once('value')
    .then(s => s.val());

  try {
    await _findMeetingTimes(sessionId);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error.');
  }
}
