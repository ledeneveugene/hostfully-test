import dayjs from "dayjs";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  CheckInOut,
  DATE_FORMAT,
} from "../constants";

/**
 * formats date using timeZone, not your browser time zone
 * @example
 * date = 1720898700000, new Date(date) ->
 * "Sun Jul 14 2024 09:25:00 GMT+1400 (Line Islands Time)"
 * getTimezonedDate(1720898700000, "Europe/Berlin") ->
 * 2024-07-13T21:25:00+02:00
 */
export const getTimezonedDate = (
  date: number,
  timeZone: string,
  format: string = DATE_FORMAT
): string => dayjs.tz(date, timeZone).format(format);

export const getDateIntervalString = (
  dates: [number, number],
  timeZone: string,
  format: string = DATE_FORMAT
) => {
  const start = getTimezonedDate(dates[0], timeZone, format);
  const end = getTimezonedDate(dates[1], timeZone, format);

  return `${start} - ${end}`;
};

export interface AddCheckInOutTimeToStartEndDatesArgs {
  start: number;
  end: number;
  timeZone: string;
  checkIn?: CheckInOut;
  checkOut?: CheckInOut;
}

/**
 * function converts timestamp from browser time zone to tomeZone
 * and set checkIn time for start and cheskOut time for end
 * @example
 * timeZone = Europe/Berlin.
 * Browser time Sat Jul 13 2024 21:36:00 GMT+1400 (Line Islands Time) ->
 * timeZone time Sat Jul 13 2024 21:36:00 GMT+0200 (Europe/Berlin) ->
 * change time Sat Jul 13 2024 12:00:00 GMT+0200 (Europe/Berlin) ->
 * returns timestamp
 */
export const addCheckInOutTimeToStartEndDates = (
  args: AddCheckInOutTimeToStartEndDatesArgs
) => {
  const {
    start,
    end,
    timeZone,
    checkIn = CHECK_IN_TIME,
    checkOut = CHECK_OUT_TIME,
  } = args;
  return {
    start: dayjs(start)
      .tz(timeZone, true)
      .hour(checkIn.h)
      .minute(checkIn.m)
      .second(checkIn.s)
      .millisecond(0)
      .valueOf(),
    end: dayjs(end)
      .tz(timeZone, true)
      .hour(checkOut.h)
      .minute(checkOut.m)
      .second(checkOut.s)
      .millisecond(0)
      .valueOf(),
  };
};
