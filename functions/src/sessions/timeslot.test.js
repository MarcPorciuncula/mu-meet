import test from 'ava';
import {
  Timeslot,
  getTimeslotsInRange,
  getTimeslotsOverRange,
  getBoundaryTimeslotsOverRange,
  getAvailableTimeslots,
  getWeekdaysOverRange,
} from './timeslot';

// const toJSON = x =>
//   typeof x !== 'undefined' && x !== null && x.toJSON ? x.toJSON() : x;

test('Timeslot constructor discards milliseconds portion of date', t => {
  const start = new Date('2017-06-03T14:00:00.002Z');
  const duration = 30;

  const result = new Timeslot(start, duration);

  t.deepEqual(result, new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30));
});

test('Timeslot.fromRange creates a timeslot based on a start and end time', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T15:00:00.000Z');

  const result = Timeslot.fromRange(start, end);

  t.deepEqual(result, new Timeslot(new Date('2017-06-03T14:00:00.002Z'), 60));
});

test('Timeslot.fromRange works with true end times (ie. 1 second before the hour)', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T14:59:59.000Z');

  const result = Timeslot.fromRange(start, end);

  t.deepEqual(result, new Timeslot(new Date('2017-06-03T14:00:00.002Z'), 60));
});

test('Timeslot#subdivide splits a timeslot into multiple smaller ones', t => {
  const original = new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30);

  const result = original.subdivide(15);

  t.deepEqual(result, [
    new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 15),
    new Timeslot(new Date('2017-06-03T14:15:00.000Z'), 15),
  ]);
});

test('Timeslot.accumulate combines adjacent (ordered and aligned) timeslots', t => {
  {
    const start = new Date('2017-06-03T14:00:00.000Z');
    const duration = 600;
    const range = new Timeslot(start, duration);
    const timeslots = range.subdivide(30);

    const result = Timeslot.accumulate(timeslots);

    t.deepEqual(result, [range]);
  }
  {
    const start = new Date('2017-06-03T14:00:00.000Z');
    const duration = 600;
    const range = new Timeslot(start, duration);
    const timeslots = range.subdivide(30);
    timeslots.splice(1, 1);

    const result = Timeslot.accumulate(timeslots);

    t.deepEqual(result, [
      new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30),
      new Timeslot(new Date('2017-06-03T15:00:00.000Z'), 540),
    ]);
  }
});

test('getTimeslotsInRange returns timeslots of the given duration in the range', t => {
  {
    const start = new Date('2017-06-03T16:00:00.000Z');
    const end = new Date('2017-06-03T16:29:59.000Z');
    const duration = 30;

    const result = getTimeslotsInRange(start, end, duration);

    t.deepEqual(result, [
      new Timeslot(new Date('2017-06-03T16:00:00.000Z'), 30),
    ]);
  }
  {
    const start = new Date('2017-06-03T14:00:00.000Z');
    const end = new Date('2017-06-03T15:59:59.000Z');
    const duration = 30;

    const result = getTimeslotsInRange(start, end, duration);

    t.deepEqual(result, [
      new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30),
      new Timeslot(new Date('2017-06-03T14:30:00.000Z'), 30),
      new Timeslot(new Date('2017-06-03T15:00:00.000Z'), 30),
      new Timeslot(new Date('2017-06-03T15:30:00.000Z'), 30),
    ]);
  }
});

test('getTimeslotsInRange only includes timeslots that completely fit within the range', t => {
  {
    const start = new Date('2017-06-03T16:00:00.000Z');
    const end = new Date('2017-06-03T16:28:59.000Z');
    const duration = 30;

    const result = getTimeslotsInRange(start, end, duration);

    t.deepEqual(result, []);
  }
  {
    const start = new Date('2017-06-03T16:00:00.000Z');
    const end = new Date('2017-06-03T16:58:59.000Z');
    const duration = 30;

    const result = getTimeslotsInRange(start, end, duration);

    t.deepEqual(result, [
      new Timeslot(new Date('2017-06-03T16:00:00.000Z'), 30),
    ]);
  }
});

test('getTimeslotsInRange can return timeslots that are aligned to a different start time', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T15:59:59.000Z');
  const align = new Date('2017-06-03T13:10:00.000Z');
  const duration = 30;

  const result = getTimeslotsInRange(start, end, duration, align);

  t.deepEqual(result, [
    new Timeslot(new Date('2017-06-03T14:10:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T14:40:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T15:10:00.000Z'), 30),
  ]);
});

test('getBoundaryTimeslotsOverRange returns timeslots that cross the start and end boundaries of the range', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T15:59:59.000Z');
  const align = new Date('2017-06-03T13:10:00.000Z');
  const duration = 30;

  const result = getBoundaryTimeslotsOverRange(start, end, duration, align);

  t.deepEqual(result, {
    start: new Timeslot(new Date('2017-06-03T13:40:00.000Z'), 30),
    end: new Timeslot(new Date('2017-06-03T15:40:00.000Z'), 30),
  });
});

test('getBoundaryTimeslotsOverRange returns nothing if the boundaries of the range are aligned to the start', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T15:59:59.000Z');
  const align = new Date('2017-06-03T34:00:00.000Z');
  const duration = 30;

  const result = getBoundaryTimeslotsOverRange(start, end, duration, align);

  t.deepEqual(result, {
    start: null,
    end: null,
  });
});

test('getTimeslotsOverRange returns timeslots of the given range within and on the boundaries of the range', t => {
  const start = new Date('2017-06-03T14:00:00.000Z');
  const end = new Date('2017-06-03T15:59:59.000Z');
  const align = new Date('2017-06-03T13:10:00.000Z');
  const duration = 30;

  const result = getTimeslotsOverRange(start, end, duration, align);

  t.deepEqual(result, [
    new Timeslot(new Date('2017-06-03T13:40:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T14:10:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T14:40:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T15:10:00.000Z'), 30),
    new Timeslot(new Date('2017-06-03T15:40:00.000Z'), 30),
  ]);
});

test('getAvailableTimeslots finds all subdivided timeslots that are not occupied', t => {
  const range = new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 60);
  const occupied = [
    new Timeslot(new Date('2017-06-03T14:10:00.000Z'), 7),
    new Timeslot(new Date('2017-06-03T13:59:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:30:00.000Z'), 1),
  ];

  const result = getAvailableTimeslots(range, occupied, 5);

  t.deepEqual(result, [
    new Timeslot(new Date('2017-06-03T14:05:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:20:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:25:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:35:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:40:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:45:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:50:00.000Z'), 5),
    new Timeslot(new Date('2017-06-03T14:55:00.000Z'), 5),
  ]);
});

test('getWeekdaysOverRange splits the given range into weekdays', t => {
  const start = new Date(2017, 6, 30);
  const range = new Timeslot(start, 7 * 24 * 60);

  const result = getWeekdaysOverRange(
    range,
    [true, true, true, true, true, true, true],
    {
      timezoneOffset:
        new Date().getTimezoneOffset() - start.getTimezoneOffset(),
    },
  );

  t.deepEqual(result, [
    new Timeslot(new Date(2017, 6, 30), 24 * 60),
    new Timeslot(new Date(2017, 6, 31), 24 * 60),
    new Timeslot(new Date(2017, 7, 1), 24 * 60),
    new Timeslot(new Date(2017, 7, 2), 24 * 60),
    new Timeslot(new Date(2017, 7, 3), 24 * 60),
    new Timeslot(new Date(2017, 7, 4), 24 * 60),
    new Timeslot(new Date(2017, 7, 5), 24 * 60),
  ]);
});

test('getWeekdaysOverRange returns weekdays covering the start and end boundaries of the range', t => {
  const start = new Date(2017, 6, 30, 12);
  const range = new Timeslot(start, 6 * 24 * 60);

  const result = getWeekdaysOverRange(
    range,
    [true, true, true, true, true, true, true],
    {
      timezoneOffset:
        new Date().getTimezoneOffset() - start.getTimezoneOffset(),
    },
  );

  t.deepEqual(result, [
    new Timeslot(new Date(2017, 6, 30), 24 * 60),
    new Timeslot(new Date(2017, 6, 31), 24 * 60),
    new Timeslot(new Date(2017, 7, 1), 24 * 60),
    new Timeslot(new Date(2017, 7, 2), 24 * 60),
    new Timeslot(new Date(2017, 7, 3), 24 * 60),
    new Timeslot(new Date(2017, 7, 4), 24 * 60),
    new Timeslot(new Date(2017, 7, 5), 24 * 60),
  ]);
});

test('getWeekdaysOverRange filters out weekdays specified', t => {
  const start = new Date(2017, 6, 30);
  const range = new Timeslot(start, 7 * 24 * 60);

  const result = getWeekdaysOverRange(
    range,
    [false, true, true, true, true, true, true],
    {
      timezoneOffset:
        new Date().getTimezoneOffset() - start.getTimezoneOffset(),
    },
  );

  t.deepEqual(result, [
    // new Timeslot(new Date(2017, 6, 30), 24 * 60),
    new Timeslot(new Date(2017, 6, 31), 24 * 60),
    new Timeslot(new Date(2017, 7, 1), 24 * 60),
    new Timeslot(new Date(2017, 7, 2), 24 * 60),
    new Timeslot(new Date(2017, 7, 3), 24 * 60),
    new Timeslot(new Date(2017, 7, 4), 24 * 60),
    new Timeslot(new Date(2017, 7, 5), 24 * 60),
  ]);
});

test('getWeekdaysOverRange works over more than one week', t => {
  const start = new Date(2017, 6, 30);
  const range = new Timeslot(start, 14 * 24 * 60);

  const result = getWeekdaysOverRange(
    range,
    [false, true, true, true, true, true, false],
    {
      timezoneOffset:
        new Date().getTimezoneOffset() - start.getTimezoneOffset(),
    },
  );

  t.deepEqual(result, [
    // new Timeslot(new Date(2017, 6, 30), 24 * 60),
    new Timeslot(new Date(2017, 6, 31), 24 * 60),
    new Timeslot(new Date(2017, 7, 1), 24 * 60),
    new Timeslot(new Date(2017, 7, 2), 24 * 60),
    new Timeslot(new Date(2017, 7, 3), 24 * 60),
    new Timeslot(new Date(2017, 7, 4), 24 * 60),
    // new Timeslot(new Date(2017, 7, 5), 24 * 60),
    // new Timeslot(new Date(2017, 7, 6), 24 * 60),
    new Timeslot(new Date(2017, 7, 7), 24 * 60),
    new Timeslot(new Date(2017, 7, 8), 24 * 60),
    new Timeslot(new Date(2017, 7, 9), 24 * 60),
    new Timeslot(new Date(2017, 7, 10), 24 * 60),
    new Timeslot(new Date(2017, 7, 11), 24 * 60),
    // new Timeslot(new Date(2017, 7, 12), 24 * 60),
  ]);
});
