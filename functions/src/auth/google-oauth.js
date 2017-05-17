import * as admin from 'firebase-admin';
import a from 'awaiting';
import google from 'googleapis';
import credentials from '../credentials';

const GOOGLE_OAUTH_ERROR_CODES = {
  NO_CREDENTIALS_FOUND: 'google-oauth/no-credentials-found',
};

export class GoogleOAuthError extends Error {
  static get codes() {
    return GOOGLE_OAUTH_ERROR_CODES;
  }
  constructor(code, message) {
    super(message);
    this.message = message;
    this.name = 'GoogleOAuthError';
    this.code = code;
  }
}

/**
 * Returns a new OAuth2Client for a given firebase user
 * @param  {string} uid firebase user uid
 */
export async function getOAuth2Client(uid) {
  const database = admin.database();

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
    a.delay(10e3),
  ]);

  if (!tokens) {
    console.error(
      `Could not retrieve Google Credentials for user ${uid} within the time limit`
    );
    throw new GoogleOAuthError(
      GoogleOAuthError.codes.NO_CREDENTIALS_FOUND,
      `Could not retrieve Google Credentials for user ${uid} within the time limit`
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );
  oAuth2Client.setCredentials(tokens);

  const save = async () => {
    // FIXME this could revive a deleted account
    await tokensRef.transaction(x =>
      Object.assign(x || {}, oAuth2Client.credentials)
    );
    console.log(`Updated credentials for user ${uid}`);
  };

  return { save, oAuth2Client };
}
