import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import shortid from 'shortid';
import { compose } from 'compose-middleware';
import request from 'request-promise-native';
import bodyParser from 'body-parser';
import cors from './cors';
import credentials from './credentials';

export async function validateFirebaseIdToken(req, res, next) {
  console.log('Check request is authorized with Firebase ID Token');

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
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

// Takes a Google OAuth2 authorization code, and claims it for the access and refresh tokens.
// Returns a google id_token which can be used to sign in with firebase, and a link code
// Once signed in, the user must link their account back to their credentials
export const claimAuthCode = functions.https.onRequest(
  compose([
    cors,
    bodyParser.json(),
    async (req, res) => {
      const code = req.body.code;
      try {
        console.log(`Obtaining auth tokens from auth code.`);
        const response = await request({
          uri: 'https://www.googleapis.com/oauth2/v4/token',
          method: 'POST',
          form: {
            code,
            client_id: credentials.web.client_id,
            client_secret: credentials.web.client_secret,
            redirect_uri: credentials.web.redirect_uris[0],
            grant_type: 'authorization_code',
          },
        }).then(JSON.parse);
        const credentialLinkCode = shortid.generate();
        await admin
          .database()
          .ref(`/google-credentials/${credentialLinkCode}`)
          .set(response);
        console.log(
          `Auth tokens obtained for user with id token ${response.id_token}.`,
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(
          200,
          JSON.stringify({
            id_token: response.id_token,
            credential_link_code: credentialLinkCode,
          }),
        );
      } catch (err) {
        console.error('Error obtaining tokens', err);
        res.send(504, 'Internal Server Error');
        return;
      }
    },
  ]),
);

// Takes a link code previously issued to the user from claimAuthCode, and links
// the Googla OAuth2 credentials to their firebase account.
export const linkGoogleCredentials = functions.https.onRequest(
  compose([
    cors,
    validateFirebaseIdToken,
    bodyParser.json(),
    async (req, res) => {
      const { uid } = res.locals.idToken;
      const { credential_link_code: credentialLinkCode } = req.body;
      console.log(
        `Linking account ${uid} with google credentials with link code ${credentialLinkCode}`,
      );
      const snapshot = await admin
        .database()
        .ref(`/google-credentials/${credentialLinkCode}`)
        .once('value');
      const credential = snapshot.val();
      console.log(credential);
      if (!credential) {
        console.error(
          `There were no credentials with credential link code ${credentialLinkCode}`,
        );
        res.send(401, 'Unauthorized');
        return;
      }
      await admin
        .database()
        .ref(`/users/${uid}/tokens`)
        .transaction(value => Object.assign(value || {}, credential));
      await admin
        .database()
        .ref(`/google-credentials/${credentialLinkCode}`)
        .set(null);
      console.log('Success');
      res.send(200, 'Success');
      return;
    },
  ]),
);
