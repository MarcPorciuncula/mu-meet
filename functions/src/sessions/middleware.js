import { SessionError, createSession as _createSession } from './sessions';

export async function createSession(req, res) {
  const { uid } = res.locals.idToken;

  try {
    await _createSession(uid);
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
