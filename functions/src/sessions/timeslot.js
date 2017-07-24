// @flow

import R from 'ramda';
import addMinutes from 'date-fns/add_minutes';
import addSeconds from 'date-fns/add_seconds';
import setMilliseconds from 'date-fns/set_milliseconds';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isEqual from 'date-fns/is_equal';
import compareAsc from 'date-fns/compare_asc';
import getDifferenceInMinutes from 'date-fns/difference_in_minutes';
import getSeconds from 'date-fns/get_seconds';

export class Timeslot {
  start: Date;
  end: Date;
  duration: number;

  constructor(start: Date, duration: number) {
    this.start = setMilliseconds(start, 0);
    this.duration = duration /* in minutes */;
    this.end = addSeconds(addMinutes(this.start, this.duration), -1);
  }

  subdivide(
    duration: number,
    {
      align = this.start,
      includeBoundaries = false,
    }: { align?: Date, includeBoundaries?: boolean } = {},
  ): Array<Timeslot> {
    const getTimeslots = includeBoundaries
      ? getTimeslotsOverRange
      : getTimeslotsInRange;
    return getTimeslots(this.start, this.end, duration, align);
  }

  static accumulate(timeslots: Array<Timeslot>): Array<Timeslot> {
    return timeslots.reduce((timeslots, timeslot) => {
      if (!timeslots.length) {
        return [timeslot];
      }
      const last = timeslots[timeslots.length - 1];
      if (isEqual(addMinutes(last.start, last.duration), timeslot.start)) {
        return [
          ...timeslots.slice(0, timeslots.length - 1),
          new Timeslot(last.start, last.duration + timeslot.duration),
        ];
      } else {
        return [...timeslots, timeslot];
      }
    }, []);
  }

  static fromJSON(data) {
    return new Timeslot(new Date(data.start), data.duration);
  }

  static fromRange(start, end) {
    if (getSeconds(end) === 59) {
      end = addSeconds(end, 1);
    }
    const duration = getDifferenceInMinutes(end, start);
    return new Timeslot(start, duration);
  }

  toJSON() {
    return {
      start: this.start.toISOString(),
      duration: this.duration,
      end: this.end.toISOString(),
    };
  }
}

export function getTimeslotsInRange(
  rangeStart: Date,
  rangeEnd: Date,
  timeslotDuration: number,
  start?: Date = rangeStart,
): Array<Timeslot> {
  const timeslots = [];
  let current = start;

  while (isBefore(current, rangeEnd)) {
    const timeslot = new Timeslot(current, timeslotDuration);
    if (
      !isBefore(timeslot.start, rangeStart) &&
      !isAfter(timeslot.end, rangeEnd)
    ) {
      timeslots.push(timeslot);
    }
    current = addMinutes(current, timeslotDuration);
  }

  return timeslots;
}

export function getTimeslotsOverRange(
  rangeStart: Date,
  rangeEnd: Date,
  timeslotDuration: number,
  start?: Date = rangeStart,
): Array<Timeslot> {
  const timeslots = getTimeslotsInRange(
    rangeStart,
    rangeEnd,
    timeslotDuration,
    start,
  );
  const boundaries = getBoundaryTimeslotsOverRange(
    rangeStart,
    rangeEnd,
    timeslotDuration,
    start,
  );

  if (boundaries.start) {
    timeslots.splice(0, 0, boundaries.start);
  }
  if (boundaries.end) {
    timeslots.push(boundaries.end);
  }

  return timeslots;
}

type Boundaries = {
  start: Timeslot | null,
  end: Timeslot | null,
};

export function getBoundaryTimeslotsOverRange(
  rangeStart: Date,
  rangeEnd: Date,
  timeslotDuration: number,
  start?: Date = rangeStart,
): Boundaries {
  const boundaries = ({
    start: null,
    end: null,
  }: Boundaries);
  let current = start;

  while (isBefore(current, rangeEnd)) {
    const timeslot = new Timeslot(current, timeslotDuration);
    if (
      isBefore(timeslot.start, rangeStart) &&
      isAfter(timeslot.end, rangeStart)
    ) {
      boundaries.start = timeslot;
    } else if (
      isBefore(timeslot.start, rangeEnd) &&
      isAfter(timeslot.end, rangeEnd)
    ) {
      boundaries.end = timeslot;
    }
    current = addMinutes(current, timeslotDuration);
  }

  return boundaries;
}

export function getAvailableTimeslots(
  range: Timeslot,
  occupied: Array<Timeslot>,
  duration: number,
): Array<Timeslot> {
  const isAvailable = {};

  for (let timeslot of range.subdivide(duration)) {
    isAvailable[timeslot.start.toISOString()] = true;
  }

  for (let timeslot of occupied) {
    const spanned = timeslot.subdivide(duration, {
      align: range.start,
      includeBoundaries: true,
    });
    for (let timeslot of spanned) {
      isAvailable[timeslot.start.toISOString()] = false;
    }
  }

  const timeslots = R.toPairs(isAvailable)
    .filter(([timestamp, available]) => available)
    .map(([timestamp]) => new Date(timestamp))
    .sort(compareAsc)
    .map(start => new Timeslot(start, duration));

  return timeslots;
}
