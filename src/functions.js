import axios from 'axios';
import firebase from 'firebase';
import { config } from '@/firebase.config';

const FUNCTIONS_URI = `https://us-central1-${config.projectId}.cloudfunctions.net/`;

export async function functions(fnName, options = {}) {
  const headers = Object.assign({}, options.headers);

  const currentUser = firebase.auth().currentUser;
  const firebaseToken = currentUser && (await currentUser.getToken(true));
  if (firebaseToken) {
    headers.Authorization = `Bearer ${firebaseToken}`;
  }

  return axios(
    Object.assign({}, options, {
      headers,
      method: 'post',
      url: FUNCTIONS_URI + fnName,
    }),
  );
}
