import google from 'googleapis';
import a from 'awaiting';

export async function fetchUserProfile(uid, oAuth2Client) {
  const { userinfo } = google.oauth2({
    version: 'v2',
    auth: oAuth2Client,
  });

  const details = await a.callback(cb => userinfo.v2.me.get(cb));

  return details;
}
