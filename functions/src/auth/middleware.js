import admin from 'firebase-admin';
import a from 'awaiting';
import credentials from '../credentials';
import google from 'googleapis';
import shortid from 'shortid';
import { getOAuth2Client, GoogleOAuthError } from './google-oauth';

/**
 * Validates and decodes Firebase ID token and places it on `res.locals.idToken`
 * @param  {ExpressRequest} req
 * @param  {ExpressResponse} res
 * @param  {Function} next
 */
export async function validateFirebaseIdToken(req, res, next) {
  console.log('Check request is authorized with Firebase ID Token');

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>'
    );
    res.status(403).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    console.error('Error while verifying Firebase ID token:', err);
    res.status(403).send('Unauthorized');
    return;
  }

  Object.assign(res.locals, { idToken: decodedToken });
  console.log('Request is authorized.');
  next();
}

/**
 * Places a Google OAuth2 client onto locals.oAuth2Client, using the user's credentials from the database
 * @param  {ExpressRequest} req
 * @param  {ExpressResponse} res
 * @param  {string} res.locals.idToken.uid The user's firebase uid
 */
export async function withOAuth2Client(req, res, next) {
  const { uid } = res.locals.idToken;

  let save;
  let oAuth2Client;
  try {
    ({ save, oAuth2Client } = await getOAuth2Client(uid));
  } catch (err) {
    if (err.code === GoogleOAuthError.codes.NO_CREDENTIALS_FOUND) {
      res.send(403, 'Unauthorized');
    }
  }

  Object.assign(res.locals, { oAuth2Client });
  res.on('finish', save);

  next();
}

/**
 * Gets Google API OAuth2 tokens and stores them in the database, sends id_token for Firebase authentication, and credential_link_code to claim the tokens.
 * @param  {ExpressRequest} req
 * @param  {string} req.body.code An OAuth2 authorization code
 * @param  {ExpressResponse} res
 */
export async function getGoogleOAuth2Authorization(req, res) {
  const database = admin.database();
  const { code } = req.body;

  const oauth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );

  console.log('Obtain OAuth2 tokens from authorization code', code);
  const tokens = await a.callback(
    oauth2Client.getToken.bind(oauth2Client),
    code
  );

  const credentialLinkCode = shortid.generate();
  console.log('Store against link code', credentialLinkCode);
  await database.ref(`/google-credentials/${credentialLinkCode}`).set(tokens);

  console.log('Success');
  res.setHeader('Content-Type', 'application/json');
  res.send(
    200,
    JSON.stringify({
      id_token: tokens.id_token,
      credential_link_code: credentialLinkCode,
    })
  );
}

/**
 * Moves Google API OAuth tokens from intermediate storage to the user's record in the database
 * @param  {ExpressRequest} req
 * @param  {string} req.body.credential_link_code A code issued by getGoogleOAuth2Authorization
 * @param  {ExpressResponse} res
 * @param  {string} res.locals.idToken.uid The user's firebase uid
 */
export async function linkGoogleOAuthToFirebaseUser(req, res) {
  const database = admin.database();
  const { uid } = res.locals.idToken;
  const { credential_link_code: credentialLinkCode } = req.body;

  console.log(
    `Link Google OAuth2 credentials ${credentialLinkCode} to user ${uid}`
  );
  const snapshot = await database
    .ref(`/google-credentials/${credentialLinkCode}`)
    .once('value');
  const tokens = snapshot.val();

  if (!tokens) {
    console.error(
      `There are no credentials associated with link code ${credentialLinkCode}`
    );
    res.send(401, 'Unauthorized');
    return;
  }

  await database
    .ref(`/users/${uid}/tokens`)
    .transaction(x => Object.assign(x || {}, tokens));
  await database.ref(`/google-credentials/${credentialLinkCode}`).set(null);

  console.log('Success');
  res.send(200, 'OK');
}
