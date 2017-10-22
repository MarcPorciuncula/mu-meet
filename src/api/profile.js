// @flow
import firebase from './firebase';

export default {
  async get(uid: string) {
    const database = await firebase.database();

    const data = await database
      .ref(`/users/${uid}/profile`)
      .once('value')
      .then(s => s.val());

    return data;
  },
};
