import axios from 'axios';
import firebase, { config } from '@/firebase';

const FUNCTIONS_URI = `https://us-central1-${config.projectId}.cloudfunctions.net/`;

export async function functions(fnName, options = {}) {
  const headers = Object.assign({}, options.headers);

  const currentUser = firebase.auth().currentUser;
  const firebaseToken = currentUser && (await currentUser.getToken(false));
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
