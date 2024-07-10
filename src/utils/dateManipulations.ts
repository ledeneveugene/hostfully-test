import dayjs from "dayjs";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  CheckInOut,
  DATE_FORMAT,
} from "../constants";

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
    start: dayjs
      .tz(start, timeZone)
      .hour(checkIn.h)
      .minute(checkIn.m)
      .second(checkIn.s)
      .millisecond(0)
      .valueOf(),
    end: dayjs
      .tz(end, timeZone)
      .hour(checkOut.h)
      .minute(checkOut.m)
      .second(checkOut.s)
      .millisecond(0)
      .valueOf(),
  };
};
