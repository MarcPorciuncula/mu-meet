import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * from './sessions';
export * from './auth';
export * from './calendar';
export * from './users';
