export const DEFAULT_FRACTIONS = 2;
export const DATE_FORMAT = "MM.DD.YY";

export interface CheckInOut {
  h: number;
  m: number;
  s: number;
  ms: number;
}

export const CHECK_IN_TIME: CheckInOut = {
  h: 14,
  m: 0,
  s: 0,
  ms: 0,
};

export const CHECK_OUT_TIME: CheckInOut = {
  h: 12,
  m: 0,
  s: 0,
  ms: 0,
};
