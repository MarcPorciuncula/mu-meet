/* global gapi */

export const SCOPE = 'https://www.googleapis.com/auth/calendar';

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
      clientId: '569083161786-h71j7a2haos4d1ohu6t8hru61ffv4s56.apps.googleusercontent.com',
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      ],
    }),
  )
  .then(() => gapi);

export default function getGoogle() {
  return client;
}
