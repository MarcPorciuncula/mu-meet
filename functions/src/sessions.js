import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateFirebaseIdToken } from './auth';
import shortid from 'shortid';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import cors from 'cors';
import { compose } from 'compose-middleware';
// import R from 'ramda';

const PHASE_LOBBY = 'PHASE_LOBBY';

const DEFAULT_SESSION_STATE = {
  host: null,
  phase: PHASE_LOBBY,
  users: {},
  config: {
    minDuration: 1,
    searchFromDate: getStartOfWeek(new Date()).toISOString(),
    searchToDate: getEndOfWeek(new Date()).toISOString(),
    searchFromHour: 9,
    searchToHour: 18,
    days: {
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    },
  },
  result: {
    pending: false,
    meetings: [],
  },
};

export const createSession = functions.https.onRequest(
  compose([
    cors({ origin: true }),
    validateFirebaseIdToken,
    async (req, res) => {
      const { uid } = res.locals.idToken;

      // TODO check that they're not aready in another session

      const database = admin.database();

      const userSnapshot = await database.ref(`/users/${uid}`).once('value');
      const user = userSnapshot.val();

      const id = shortid.generate();
      await Promise.all([
        database.ref(`/sessions/${id}`).set(
          Object.assign({}, DEFAULT_SESSION_STATE, {
            host: uid,
            users: {
              [uid]: { ready: false },
            },
          }),
        ),
        database.ref(`/users/${uid}/currentSession`).set(id),
      ]);
      console.log(`User ${uid} (${user.displayName}) created session ${id}`);

      res.status(201).send('Success');
    },
  ]),
);
