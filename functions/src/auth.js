import * as admin from 'firebase-admin';

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
