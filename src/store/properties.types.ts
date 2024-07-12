import { ERROR_TYPE } from "../constants";
export interface Property {
  id: string;
  name: string;
  address: string;
  rating: PropertyRating;
  bookings: Booking[];
  review: PropertyReview;
  imageURL: string;
  timeZone: string;
  dailyPrice: DailyPrice;
}

export interface DailyPrice {
  price: number;
  oldPrice: number;
  currency: string;
}

export interface Booking {
  id: string;
  start: number;
  end: number;
  userId: string;
  comment: string;
}

export interface BookingError {
  type: ERROR_TYPE.BOOKING_ERROR;
  message: string;
}

export type Users = Record<
  string,
  {
    name: string;
  }
>;

export interface PropertyReview {
  point: number;
  description: string;
  numberOfReviews: number;
}

export interface PropertyRating {
  value: number;
  fractions?: number;
}

export type InsertBooking = Omit<Booking, "id">;
export type UpdateBooking = Booking;

export type BookedDays = Record<
  number,
  Record<number, Record<number, boolean>>
>;

export interface EditPropertyModal {
  opened: boolean;
  booking?: Booking;

  setBooking: (id: string | undefined) => void;
  open: () => void;
  close: () => void;
}
