import admin from 'firebase-admin';

export async function invalidateSessionResult(event) {
  const database = admin.database();
  const { sessionId } = event.params;

  console.log('Invalidating result for session', sessionId);

  await database.ref(`/sessions/${sessionId}/result/stale`).set(true);
}
