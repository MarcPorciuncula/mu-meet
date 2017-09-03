import * as admin from 'firebase-admin';
import a from 'awaiting';
import google from 'googleapis';
import request from 'request-promise-native';
import isPast from 'date-fns/is_past';
import getDistanceInWordsStrict from 'date-fns/distance_in_words_strict';
import credentials from '../credentials';

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

export class WaitForValueTimeoutError extends Error {}

/**
 * Returns a new OAuth2Client for a given firebase user
 * @param  {string} uid firebase user uid
 */
export async function getOAuth2Client(uid) {
  const database = admin.database();

  const tokensRef = database.ref(`/users/${uid}/tokens`);
  let tokens;
  // It may take a while for the server to retrieve tokens and place them onto the user, we'll watch the ref until a value is present or it times out
  try {
    tokens = await waitForValue(tokensRef);
  } catch (err) {
    if (err instanceof WaitForValueTimeoutError) {
      throw new GoogleOAuthError(
        GoogleOAuthError.codes.NO_CREDENTIALS_FOUND,
        `Could not retrieve Google Credentials for user ${uid} within the time limit`,
      );
    }
    throw err;
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
  console.debug(
    'Created OAuth client for user',
    uid,
    'with credentials',
    tokens,
  );

  console.debug(
    'Credentials expire',
    getDistanceInWordsStrict(new Date(), new Date(tokens.expiry_date), {
      addSuffix: true,
    }),
  );

  if (isPast(new Date(tokens.expiry_date))) {
    console.debug('Credentials were found to be out of date, refreshing.');
    tokens = await a.callback(
      oAuth2Client.refreshAccessToken.bind(oAuth2Client),
    );
    await tokensRef.transaction(x => Object.assign(x || {}, tokens));
    console.log(`Refreshed credentials for user ${uid}`);
  }

  const save = async () => {
    // FIXME this could revive a deleted account
    await tokensRef.transaction(x =>
      Object.assign(x || {}, oAuth2Client.credentials),
    );
    console.log(`Saved credentials for user ${uid}`, oAuth2Client.credentials);
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

/**
 * Wait for a ref to be written a non null value.
 * Times out after a certain amount of time
 */
function waitForValue(ref, { timeout = 5e3 } = {}) {
  return new Promise((resolve, reject) => {
    let timeoutHandle;

    const handleError = reject;
    const handleSnapshot = snapshot => {
      const value = snapshot.val();
      if (value === null) return;
      resolve(value);
      clearTimeout(timeoutHandle);
      ref.off('value', handleSnapshot, handleError);
    };
    timeoutHandle = setTimeout(() => {
      reject(
        new WaitForValueTimeoutError(
          'Timed out while watiting for value on ref ' + ref.toString(),
        ),
      );
      ref.off('value', handleSnapshot, handleError);
    }, timeout);
    ref.on('value', handleSnapshot, handleError);
  });
}
