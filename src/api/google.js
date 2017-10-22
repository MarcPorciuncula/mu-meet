/* global gapi */
import a from 'awaiting';
import credentials from '../../secret/client.json';

export const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const client = (async () => {
  if (typeof gapi === 'undefined') {
    throw new Error(
      'Google API script must be loaded before application code.',
    );
  }
  await a.callback(gapi.load, 'client:auth2:signin2');
  await gapi.client.init({
    scope: SCOPES,
    clientId: credentials.web.client_id,
  });
  return gapi;
})();

export default async () => {
  return await client;
};
