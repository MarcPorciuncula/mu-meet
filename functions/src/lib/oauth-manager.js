// @flow
import * as admin from 'firebase-admin';
import google from 'googleapis';
import { identity, toPairs } from 'ramda';
import assert from 'assert';
import isPast from 'date-fns/is_past';
import addMinutes from 'date-fns/add_minutes';
import getDifferenceInMinutes from 'date-fns/difference_in_minutes';
import a from 'awaiting';
import googleClientCredentials from '../credentials';

const { OAuth2 } = google.auth;

const CLEANUP_INTERVAL = 20 * 60e3;

class WatchTimeoutError extends Error {}

class OAuthManager {
  _credentials: {
    web: {
      client_id: string,
      client_secret: string,
      redirect_uris: Array<string>,
    },
  };
  _clients: Map<string, { client: any, lastAccessed: Date }>;
  _intervalId: *;

  constructor(credentials: *) {
    this._credentials = credentials;
    this._clients = new Map();
  }

  async getClient(uid: string) {
    if (!this._intervalId) {
      this._initCleanupSchedule();
    }

    let record = this._clients.get(uid);
    if (!record) {
      record = await this._createClient(uid);
    }
    record.lastAccessed = new Date();
    this._refreshClientTokenIfExpired(uid);
    return record.client;
  }

  async _createClient(uid: string) {
    const database = admin.database();
    const tokensRef = await database.ref(`/users/${uid}/tokens`);

    // It may take some time for the server to populate tokens if this
    // is the user's first login, we'll watch the ref until a value
    // is present.
    let tokens = await watch(tokensRef);

    assert(
      this._credentials.web.redirect_uris.includes(tokens.redirect_uri),
      'Could not find a redirect_uri in google api credentials that matches ' +
        tokens.redirect_uri,
    );

    const client = new OAuth2(
      this._credentials.web.client_id,
      this._credentials.web.client_secret,
      tokens.redirect_uri,
    );
    client.setCredentials(tokens);
    const record = { client, lastAccessed: new Date() };
    this._clients.set(uid, record);

    return record;
  }

  async _refreshClientTokenIfExpired(uid: string) {
    const record = await this._clients.get(uid);
    if (!record) return;

    const { client } = record;
    const database = admin.database();
    const tokensRef = await database.ref(`/users/${uid}/tokens`);
    let tokens = await tokensRef.once('value').then(s => s.val());

    // We'll refresh tokens if they're within ten minutes of expiring
    const expiry = addMinutes(new Date(tokens.expiry_date), -10);
    if (!isPast(expiry)) return;

    tokens = await a.callback(client.refreshAccessToken.bind(client));
    console.log('tokens', tokens);
    await a.list(
      toPairs(tokens).map(([key, value]) => tokensRef.child(key).set(value)),
    );
  }

  _freeClients() {
    for (const [uid, record] of this._clients.entries()) {
      if (getDifferenceInMinutes(new Date(), record.lastAccessed) > 10) {
        this._clients.delete(uid);
      }
    }
  }

  _initCleanupSchedule() {
    this._intervalId = setInterval(() => {
      this._freeClients();
    }, CLEANUP_INTERVAL);
  }
}

export default new OAuthManager(googleClientCredentials);

/**
 * Watch a database value until the predicate is satisfied and return it.
 * Rejects after timeout is reached
 */
function watch(
  ref,
  { predicate = identity, timeout = 5000 } = {},
): Promise<any> {
  return new Promise((resolve, reject) => {
    let timeoutId;
    let unsubscribe;

    const handleSnapshot = snapshot => {
      const value = snapshot.val();
      if (!predicate(value)) return;
      unsubscribe();
      resolve(value);
    };

    const handleError = err => {
      reject(err);
      unsubscribe();
    };

    unsubscribe = () => {
      ref.off('value', handleSnapshot, handleError);
      clearTimeout(timeoutId);
    };

    ref.on('value', handleSnapshot, handleError);

    timeoutId = setTimeout(() => {
      handleError(
        new WatchTimeoutError(
          `Watch on ref ${ref.toString()} timed out after ${timeout}ms.`,
        ),
      );
    }, timeout);
  });
}