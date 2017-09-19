// @flow
import invariant from 'invariant';
import firebase from './firebase';
import Auth from './auth';
import Functions, { SYNC_CALENDARS } from './functions';

const encodeId = (id: string) => btoa(id);

export default {
  async forUser(uid: string) {
    const database = firebase.database();

    const calendars = await database
      .ref(`/users/${uid}/calendars`)
      .once('value')
      .then(s => s.val());

    const selected = await database
      .ref(`/users/${uid}/selected-calendars`)
      .once('value')
      .then(s => s.val());

    for (let calendar of Object.values(calendars)) {
      invariant(
        calendar && typeof calendar === 'object',
        'expected calendar to be an object, instead got %s',
        calendar,
      );
      invariant(
        typeof calendar.id === 'string',
        'expected calendar.id to be of type string, instead got %s',
        calendar.id,
      );
      calendar.selected = !!selected[encodeId(calendar.id)];
    }

    return calendars;
  },
  update: async (
    { uid, id }: { uid: string, id: string },
    patch: { selected?: boolean },
  ) => {
    invariant(
      !Object.keys(patch).some(key => key !== 'selected'),
      'Calendars.update does not currently support updating fields other than "selected"',
    );

    const database = firebase.database();

    // TODO allow update on other fields

    if (typeof patch.selected !== 'undefined') {
      await database
        .ref(`/users/${uid}/selected-calendars/${encodeId(id)}`)
        .set(patch.selected);
    }
  },
  async sync(uid: string) {
    const user = await Auth.user();
    invariant(
      uid === user.uid,
      'Calendars.sync does not work for users other than the current user',
    );

    await Functions.call(SYNC_CALENDARS);
  },
};
