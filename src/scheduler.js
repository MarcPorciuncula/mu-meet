import getStartOfHour from 'date-fns/start_of_hour';
import getDifferenceInMinutes from 'date-fns/difference_in_minutes';
import addMinutes from 'date-fns/add_minutes';
import isBefore from 'date-fns/is_before';
import getStartOfWeek from 'date-fns/start_of_week';
import getEndOfWeek from 'date-fns/end_of_week';
import parseDate from 'date-fns/parse';
import getHours from 'date-fns/get_hours';
import compareAsc from 'date-fns/compare_asc';
import isEqual from 'date-fns/is_equal';
import addHours from 'date-fns/add_hours';
import R from 'ramda';

export function sortByDistanceFrom1PM(a, b) {
  const distanceA = Math.abs(13 - getHours(a));
  const distanceB = Math.abs(13 - getHours(b));
  if (distanceA === distanceB) {
    return 0;
  }
  if (distanceA < distanceB) {
    return -1;
  } else {
    return 1;
  }
}

export function groupIntervals(intervals) {
  const orderedIntervals = intervals.sort(compareAsc);
  let grouped = [];
  let currentGroup = {
    start: intervals[0],
    duration: 0.5,
  };
  let i = 1;
  while (i < orderedIntervals.length) {
    if (
      isEqual(
        orderedIntervals[i],
        addHours(currentGroup.start, currentGroup.duration),
      )
    ) {
      currentGroup.duration += 0.5;
    } else {
      grouped.push(currentGroup);
      currentGroup = {
        start: orderedIntervals[i],
        duration: 0.5,
      };
    }
    i++;
  }
  grouped.push(currentGroup);
  return grouped;
}

export function restrictHours(from, to) {
  return date => getHours(date) >= from && getHours(date) < to;
}

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
    const spannedIntervals = getSpannedHalfHourIntervals(
      event.start,
      event.end,
    );
    for (let interval of spannedIntervals) {
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
