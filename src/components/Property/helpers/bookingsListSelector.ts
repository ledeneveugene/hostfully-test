import { WritableDraft } from "immer";
import { AllSlices } from "../../../store/types";

export const bookingsListSelector = (store: WritableDraft<AllSlices>) => ({
  bookings: store.property.bookings,
  timeZone: store.property.timeZone,
  setBooking: store.editPropertyModal.setBooking,
  users: store.users,
  deleteBooking: store.deleteBooking,
});
