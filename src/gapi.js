/* global gapi */
import credentials from '../secret/client.json';

export const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

const client = Promise.resolve()
  .then(() => {
    if (typeof gapi === 'undefined') {
      throw new Error('Could not load Google API Script');
    }
  })
  .then(
    () => new Promise(resolve => gapi.load('client:auth2:signin2', resolve)),
  )
  .then(() =>
    gapi.client.init({
      scope: SCOPE,
      clientId: credentials.web.client_id,
    }),
  )
  .then(() => gapi);

export default function getGoogle() {
  return client;
}
