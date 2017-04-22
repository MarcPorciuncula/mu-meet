import getStartOfHour from 'date-fns/start_of_hour';
import getDifferenceInMinutes from 'date-fns/difference_in_minutes';
import addMinutes from 'date-fns/add_minutes';
import isBefore from 'date-fns/is_before';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import parseDate from 'date-fns/parse';
import R from 'ramda';

export function getFreeHalfHourIntervals(events) {
  const intervals = {};
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(new Date());

  let currentTime = startOfWeek;
  while (isBefore(currentTime, endOfWeek)) {
    intervals[currentTime.toISOString()] = true;
    currentTime = addMinutes(currentTime, 30);
  }

  for (let event of events) {
    const intervals = getSpannedHalfHourIntervals(event.start, event.end);
    for (let interval of intervals) {
      intervals[interval.toISOString()] = false;
    }
  }

  return R.compose(
    R.map(([interval, valid]) => parseDate(interval)),
    R.filter(([interval, valid]) => valid),
    R.toPairs,
  )(intervals);
}

export function getSpannedHalfHourIntervals(start, end) {
  let current = roundDownToHalfHour(start);
  let result = [];
  while (isBefore(current, end)) {
    result.push(current);
    current = addMinutes(current, 30);
  }
  return result;
}

function roundDownToHalfHour(date) {
  const reference = getStartOfHour(date);
  const differenceInMinutes = getDifferenceInMinutes(reference, date);
  if (differenceInMinutes < 30) {
    return reference;
  } else {
    return addMinutes(reference, 30);
  }
}
