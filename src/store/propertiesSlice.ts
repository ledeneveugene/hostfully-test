import { ImmerStateCreator } from "./types";
import {
  BookedDays,
  Booking,
  BookingError,
  EditPropertyModal,
  InsertBooking,
  Property,
  UpdateBooking,
  Users,
} from "./properties.types";
import { uuid } from "../utils/uuid";
import { DATE_FORMAT, ERROR_TYPE } from "../constants";
import dayjs from "dayjs";
import {
  addCheckInOutTimeToStartEndDates,
  getDateIntervalString,
} from "../utils/dateManipulations";
import { checkBookingConflicts } from "../utils/checkBookingConflicts";

const testProperty: Property = {
  id: "45",
  name: "Ilunio Les Corts Spa",
  address: "Cardenal Reig, 11, Les Corts, 08028 Barcelona, Spain",
  rating: {
    value: 4.5,
    fractions: 2,
  },
  timeZone: "Europe/Berlin",
  // bookings: [],
  dailyPrice: {
    currency: "USD",
    oldPrice: "1562.00",
    price: "1350.00",
  },
  bookings: [
    {
      id: "1",
      start: 1722081600000,
      end: 1722160800000,
      userId: "15",
      gapAfter: 0,
      gapBefore: 0,
      comment: "some comment",
    },
  ],
  review: {
    point: 8,
    description: "Very good",
    numberOfReviews: 5642,
  },
  imageURL: "/images/property_main.jpg",
};

const testUsers: Users = {
  "15": {
    name: "John Lee",
  },
};

type UpsertBooking = UpdateBooking | InsertBooking;

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

    const bookingsForChecking =
      "id" in booking && booking.id
        ? bookings.filter((b) => b.id !== booking.id)
        : bookings;

    const checkResult = checkBookingConflicts(booking, bookingsForChecking);

    if (checkResult) {
      const conflictRangeText = getDateIntervalString(
        [checkResult.start, checkResult.end],
        timeZone,
        DATE_FORMAT + " HH:mm"
      );
      return {
        type: ERROR_TYPE.BOOKING_ERROR,
        message: `Sorry, there is a conflict with ${conflictRangeText} booking. Please select other dates.`,
      };
    }

    if (!("id" in booking)) {
      // Insert
      const { start, end } = addCheckInOutTimeToStartEndDates({
        start: booking.start,
        end: booking.end,
        timeZone,
      });
      set((state) => {
        const newBooking = {
          ...booking,
          id: uuid(),
          start,
          end,
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
            const { start, end } = addCheckInOutTimeToStartEndDates({
              start: booking.start,
              end: booking.end,
              timeZone,
            });

            const newBooking = {
              ...book,
              ...booking,
              start,
              end,
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
