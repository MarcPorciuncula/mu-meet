/* global gapi */

const client = Promise.resolve()
  .then(() => new Promise(resolve => gapi.load('client:auth2', resolve)))
  .then(() =>
    gapi.client.init({
      scope: 'https://www.googleapis.com/auth/calendar',
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
