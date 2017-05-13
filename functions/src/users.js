import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import google from 'googleapis';
import credentials from './credentials';
import a from 'awaiting';

async function _onUserCreateStoreInfo(event) {
  const database = admin.database();
  const { uid } = event.data;

  console.log(`User ${uid} created.`);
  console.log('Wait for user to link Google credentials');

  let tokens;
  const tokensRef = database.ref(`/users/${uid}/tokens`);
  await a.single([
    new Promise(resolve => {
      const handler = snapshot => {
        tokens = snapshot.val();
        if (tokens) {
          tokensRef.off('value', handler);
          resolve();
        }
      };
      tokensRef.on('value', handler);
    }),
    a.delay(30e3),
  ]);

  if (!tokens) {
    console.error(
      'User did not link Google credentials within 30s, giving up.',
    );
    return;
  }

  console.log('Obtained Google credentials, retrieve profile info.');

  const oauth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0],
  );
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    version: 'v2',
    auth: oauth2Client,
  });
  const details = await a.callback(oauth2.userinfo.v2.me.get.bind(oauth2));

  console.log(details);

  await a.list(
    ['email', 'name', 'given_name', 'family_name', 'picture'].map(prop =>
      database
        .ref(`/users/${event.data.uid}/${prop}/profile`)
        .set(details[prop]),
    ),
  );

  console.log('Success');
}

export const onUserCreateStoreInfo = functions.auth
  .user()
  .onCreate(_onUserCreateStoreInfo);
