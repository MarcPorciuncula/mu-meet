// @flow
import axios from 'axios';
import Auth from './auth';
import { config } from './firebase';

const FUNCTIONS_URI = `https://us-central1-${config.projectId}.cloudfunctions.net/`;

export default {
  async call(fn: string, options: any = {}) {
    const headers = Object.assign({}, options.headers);

    const user = await Auth.user();
    if (user) {
      const token = await user.getToken(false);
      headers.Authorization = `Bearer ${token}`;
    }

    Object.assign(options, {
      headers,
      method: 'POST',
      url: FUNCTIONS_URI + fn,
    });

    return axios(options);
  },
};

export const AUTHORIZE = 'getGoogleOAuth2Authorization';
export const LINK_AUTH = 'linkGoogleOAuthToFirebaseUser';
export const SYNC_CALENDARS = 'getCalendars';
export const CREATE_PLANNER_SESSION = 'createSession';
export const GENERATE_PLANNER_RESULT = 'findMeetingTimes';
export const GET_EVENTS = 'getEvents';
