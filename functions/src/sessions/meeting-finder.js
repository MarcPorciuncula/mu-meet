// @flow
import {
  Timeslot,
  getAvailableTimeslots,
  getWeekdaysOverRange,
  getTimeRangesOverRange,
} from './timeslot';

type Options = {
  dates: { from: Date, to: Date },
  times: { from: number /* minutes */, to: number /* minutes */ },
  days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
  timezoneOffset?: number,
};

export function findAvailableTimeslots(
  events: Array<Timeslot>,
  options: Options,
): Array<Timeslot> {
  const range = Timeslot.fromRange(options.dates.from, options.dates.to);
  const restrictions = [];
  const timezoneOffset = options.timezoneOffset || 0;

  // Restrict event times
  restrictions.push(...events);

  // Restrict hours
  restrictions.push(
    ...getTimeRangesOverRange(
      range,
      { from: 0, to: options.times.from },
      { timezoneOffset },
    ),
  );
  restrictions.push(
    ...getTimeRangesOverRange(
      range,
      { from: options.times.to, to: 60 * 24 },
      { timezoneOffset },
    ),
  );

  // Restrict days
  restrictions.push(
    ...getWeekdaysOverRange(
      Timeslot.fromRange(options.dates.from, options.dates.to),
      options.days.map(day => !day),
      { timezoneOffset },
    ),
  );

  return Timeslot.accumulate(getAvailableTimeslots(range, restrictions, 30));
}
