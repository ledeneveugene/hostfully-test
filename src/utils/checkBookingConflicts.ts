
import { Booking } from "../store/properties.types";
import { isInRange } from "./isInRange";

export const checkBookingConflicts = <B extends Pick<Booking, 'start' |'end'>>(
  checkedBooking: B,
  bookings: Booking[]
) => {
  const conflicts: Booking[] = [];
  const { start, end } = checkedBooking;

  bookings.some((b) => {
    if(isInRange(b.start, b.end, start) || isInRange(b.start, b.end, end) ) {
      conflicts.push(b);
      return true;
    }
    return false;
  });

  return conflicts.length ? conflicts[0] : null;
};
