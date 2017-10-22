// @flow
import { compose, map, toPairs, evolve } from 'ramda';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import isPlainObject from 'is-plain-object';
import parseDate from 'date-fns/parse';
import a from 'awaiting';
import firebase from './firebase';
import Profile from './profile';
import Functions, {
  CREATE_PLANNER_SESSION,
  GENERATE_PLANNER_RESULT,
} from './functions';

async function patch(ref, data) {
  if (isPlainObject(data) || patch instanceof Array) {
    const children = compose(
      map(([key, value]) => patch(ref.child(key), value)),
      toPairs,
    )(data);
    return await Promise.all(children);
  } else {
    if (data instanceof Date) {
      data = data.toString();
    }
    await ref.set(data);
  }
}

Observable.fromRef = (ref, evt = 'value') =>
  Observable.create(observer => {
    const next = value => observer.next(value);
    const error = err => observer.error(err);
    ref.on(evt, next, error);
    return () => ref.off(evt, next, error);
  });

export default {
  async get(id: string) {
    const database = firebase.database();

    const session = await database
      .ref(`/sessions/${id}`)
      .once('value')
      .then(s => s.val());

    if (!session) return null;

    // Replace user id map with list of user profiles
    const profiles = await Promise.all(
      Object.keys(session.users).map(async uid =>
        Object.assign(await Profile.get(uid), { uid }),
      ),
    );

    return evolve({
      config: evolve({
        searchFromDate: parseDate,
        searchToDate: parseDate,
      }),
      result: evolve({
        meetings: map(
          evolve({
            end: parseDate,
            start: parseDate,
          }),
        ),
      }),
      users: () => profiles,
      startedAt: parseDate,
    })(session);
  },
  subscribe(id: string) {
    const database = firebase.database();

    const val = s => s.val();
    const session = database.ref(`/sessions/${id}`);

    // Replace user id map with list of user profiles
    const users = Observable.fromRef(session.child('users'))
      .map(val)
      .mergeMap(value =>
        a.list(
          Object.keys(value).map(async uid =>
            Object.assign(await Profile.get(uid), { uid }),
          ),
        ),
      );
    // Parse dates
    const config = Observable.fromRef(session.child('config'))
      .map(val)
      .map(
        evolve({
          searchFromDate: parseDate,
          searchToDate: parseDate,
        }),
      );
    // Parse dates
    const result = Observable.fromRef(session.child('result'))
      .map(val)
      .map(
        evolve({
          meetings: map(
            evolve({
              end: parseDate,
              start: parseDate,
            }),
          ),
        }),
      );

    return { users, result, config };
  },
  async update(id: string, data: any) {
    const database = firebase.database();

    const session = database.ref(`/sessions/${id}/`);

    await patch(session, data);
  },
  async forUser(uid: string): Promise<Array<string>> {
    const database = firebase.database();

    const current = await database
      .ref(`/users/${uid}/current-session`)
      .once('value')
      .then(s => s.val());

    return current;
  },
  async create() {
    const date = new Date();
    await Functions.call(CREATE_PLANNER_SESSION, {
      data: {
        startedAt: date.toString(),
        timezoneOffset: date.getTimezoneOffset(),
      },
    });
  },
  async join({ uid, id }: { uid: string, id: string }) {
    const database = firebase.database();

    // Check if the session exists using the public startedAt field
    const exists = await database
      .ref(`/sessions/${id}/startedAt`)
      .once('value')
      .then(s => s.val());
    if (!exists) {
      throw new Error(`session ${id} does not exist.`);
    }

    // Place the user into the session and set the current session.
    await database.ref(`/sessions/${id}/users/${uid}`).set(true);
    await database.ref(`/users/${uid}/current-session`).set(id);
  },
  async archive({ uid, id }: { uid: string, id: string }) {
    const database = firebase.database();

    await database.ref(`/users/${uid}/current-session`).set(null);
    await database.ref(`/users/${uid}/previous-sessions`).push(id);
  },
  async result(id: string) {
    // HACK this only works if the session is the current user's current session.

    await Functions.call(GENERATE_PLANNER_RESULT);
  },
  async hasAccess({ uid, id }: { uid: string, id: string }) {
    const database = firebase.database();

    try {
      await database.ref(`/sessions/${id}/users/${uid}`).once('value');
    } catch (err) {
      if (err.code === 'PERMISSION_DENIED') return false;
      else throw err;
    }
    return true;
  },
  async setCurrent({ uid, id }: { uid: string, id: string | null }) {
    const database = firebase.database();

    const current = await database
      .ref(`/users/${uid}/current-session`)
      .once('value')
      .then(s => s.val());

    if (current === id) {
      return;
    }

    if (current) {
      await database.ref(`/users/${uid}/previous-sessions`).push(current);
    }

    if (id) {
      const result = await database
        .ref(`/users/${uid}/previous-sessions`)
        .orderByValue()
        .equalTo(id)
        .once('value')
        .then(s => s.val());

      await Promise.all(
        Object.keys(result).map(key =>
          database.ref(`/users/${uid}/previous-sessions/${key}`).set(null),
        ),
      );
    }

    await database.ref(`/users/${uid}/current-session/`).set(id);
  },
};
