import a from 'awaiting';
import google from 'googleapis';
import assert from 'assert';

/**
 * Fetches the calendars for user uid and places it onto /users/$uid/calendars
 * @param  {string} uid the user's uid
 * @param  {OAuth2Client} oAuth2Client the Google API OAuth2 client for the user, if known
 */
export async function fetchCalendars(uid, oAuth2Client) {
  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client,
  });

  const data = await a.callback(cb => calendar.calendarList.list(cb));

  return data.items;
}

export async function fetchEvents(uid, oAuth2Client, { from, to, calendarId }) {
  const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client,
  });

  assert(
    from instanceof Date,
    `Expected 'from' to be a Date but instead got ${from}`,
  );
  assert(
    to instanceof Date,
    `Expected 'to' to be a Date but instead got ${to}`,
  );

  console.log(
    `Fetch user ${uid} events for calendar ${calendarId} from ${from} to ${to}`,
  );

  const { items: events } = await a.callback(
    calendar.events.list.bind(calendar.events),
    {
      calendarId,
      orderBy: 'startTime',
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      showDeleted: false,
      singleEvents: true,
    },
  );

  return events;
}
