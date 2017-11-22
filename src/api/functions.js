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

export const AUTHORIZE = 'get_google_oauth2_authorization';
export const LINK_AUTH = 'link_google_oauth_to_firebase_user';
export const SYNC_CALENDARS = 'get_calendars';
export const CREATE_PLANNER_SESSION = 'create_session';
export const GENERATE_PLANNER_RESULT = 'find_meeting_times';
export const GET_EVENTS = 'get_events';
