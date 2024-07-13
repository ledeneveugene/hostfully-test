import { ImmerStateCreator } from "./types";
import {
  BookedDays,
  Booking,
  BookingError,
  EditPropertyModal,
  Property,
  UpsertBooking,
  Users,
} from "./properties.types";
import { uuid } from "../utils";
import { DATE_FORMAT, ERROR_TYPE } from "../constants";
import {
  addCheckInOutTimeToStartEndDates,
  getDateIntervalString,
} from "../utils";
import { checkBookingConflicts } from "../utils";
import { testProperty, testUsers } from "./testData";

export interface PropertySlice {
  property: Property;
  users: Users;
  bookedDays: BookedDays;
  editPropertyModal: EditPropertyModal;

  upsertBooking: (booking: UpsertBooking) => Booking | BookingError | null;
  deleteBooking: (id: string) => void;
}

const initialState: Pick<PropertySlice, "property" | "users" | "bookedDays"> = {
  property: testProperty,
  users: testUsers,
  bookedDays: {},
};

export const propertySlice: ImmerStateCreator<PropertySlice> = (set, get) => ({
  ...initialState,
  upsertBooking: (booking) => {
    const { timeZone, bookings } = get().property;

    // Skip the current booking if we change one
    const bookingsForChecking =
      "id" in booking && booking.id
        ? bookings.filter((b) => b.id !== booking.id)
        : bookings;

    const { start, end } = addCheckInOutTimeToStartEndDates({
      start: booking.start,
      end: booking.end,
      timeZone,
    });
    const bookingWithCheckInOutTime = {
      ...booking,
      start,
      end,
    };

    const checkResult = checkBookingConflicts(
      bookingWithCheckInOutTime,
      bookingsForChecking
    );

    if (checkResult) {
      const conflictRangeText = getDateIntervalString(
        [checkResult.start, checkResult.end],
        timeZone,
        DATE_FORMAT + " HH:mm"
      );

      // Display the booking we have overlap with
      return {
        type: ERROR_TYPE.BOOKING_ERROR,
        message: `Sorry, there is a conflict with ${conflictRangeText} booking. Please select other dates.`,
      };
    }

    if (!("id" in booking)) {
      // Insert
      set((state) => {
        const newBooking = {
          ...bookingWithCheckInOutTime,
          id: uuid(),
        };

        state.property.bookings.push(newBooking);
        state.bookedDays = {};
      });
    } else {
      // Update
      set((state) => {
        state.property.bookings = state.property.bookings.map((book) => {
          const { id } = book;
          if (id === booking.id) {
            const newBooking = {
              ...book,
              ...bookingWithCheckInOutTime,
            };

            return newBooking;
          }

          return book;
        });
      });
    }
    return null;
  },
  deleteBooking: (id) => {
    set((state) => {
      state.property.bookings = state.property.bookings.filter(
        (b) => b.id !== id
      );
    });
  },
  editPropertyModal: {
    opened: false,
    booking: undefined,

    open: (id?: string) => {
      set((state) => {
        state.editPropertyModal.opened = true;
      });
      if (id) {
        get().editPropertyModal.setBooking(id);
      }
    },
    close: () => {
      set((state) => {
        state.editPropertyModal.opened = false;
        state.editPropertyModal.booking = undefined;
      });
    },
    setBooking: (id) => {
      set((state) => {
        if (id) {
          state.editPropertyModal.booking = state.property.bookings.find(
            (b) => b.id === id
          );
        }
        state.editPropertyModal.opened = true;
      });
    },
  },
});
