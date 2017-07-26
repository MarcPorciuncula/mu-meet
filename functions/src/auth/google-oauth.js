import * as admin from 'firebase-admin';
import a from 'awaiting';
import google from 'googleapis';
import request from 'request-promise-native';
import credentials from '../credentials';
import isPast from 'date-fns/is_past';

const GOOGLE_OAUTH_ERROR_CODES = {
  NO_CREDENTIALS_FOUND: 'google-oauth/no-credentials-found',
  UNKNOWN_HOST: 'google-oauth/unknown-host',
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
      `Could not retrieve Google Credentials for user ${uid} within the time limit`,
    );
    throw new GoogleOAuthError(
      GoogleOAuthError.codes.NO_CREDENTIALS_FOUND,
      `Could not retrieve Google Credentials for user ${uid} within the time limit`,
    );
  }

  if (!credentials.web.redirect_uris.includes(tokens.redirect_uri)) {
    throw new GoogleOAuthError(
      GoogleOAuthError.UNKNOWN_HOST,
      `Could find a redirect_uri that matches ${tokens.redirect_uri}`,
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    tokens.redirect_uri,
  );
  oAuth2Client.setCredentials(tokens);

  if (isPast(new Date(tokens.expiry_date))) {
    tokens = await a.callback(
      oAuth2Client.refreshAccessToken.bind(oAuth2Client),
    );
    await tokensRef.transaction(x => Object.assign(x || {}, tokens));
    console.log(`Updated credentials for user ${uid}`);
  }

  const save = async () => {
    // FIXME this could revive a deleted account
    await tokensRef.transaction(x =>
      Object.assign(x || {}, oAuth2Client.credentials),
    );
    console.log(`Updated credentials for user ${uid}`);
  };

  return { save, oAuth2Client };
}

export async function revoke(token) {
  await request({
    uri: 'https://accounts.google.com/o/oauth2/revoke',
    method: 'post',
    form: {
      token,
    },
  });
}
