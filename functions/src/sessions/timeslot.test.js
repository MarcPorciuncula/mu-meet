// @flow

import test from 'ava';
import {
  Timeslot,
  getTimeslotsInRange,
  getTimeslotsOverRange,
  getBoundaryTimeslotsOverRange,
} from './timeslot';

// const toJSON = x =>
//   typeof x !== 'undefined' && x !== null && x.toJSON ? x.toJSON() : x;

test('Timeslot constructor discards milliseconds portion of date', t => {
  const start = new Date('2017-06-03T14:00:00.002Z');
  const duration = 30;

  const result = new Timeslot(start, duration);

  t.deepEqual(result, new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30));
});

test('Timeslot#subdivide splits a timeslot into multiple smaller ones', t => {
  const original = new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 30);

  const result = original.subdivide(15);

  t.deepEqual(result, [
    new Timeslot(new Date('2017-06-03T14:00:00.000Z'), 15),
    new Timeslot(new Date('2017-06-03T14:15:00.000Z'), 15),
  ]);
});

test('Timeslots.accumulate combines adjacent timeslots', t => {
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
