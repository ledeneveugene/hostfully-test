import { WritableDraft } from "immer";
import { AllSlices } from "../../../store/types";

export const bookDateSelector = (store: WritableDraft<AllSlices>) => ({
  timeZone: store.property.timeZone,
  booking: store.editPropertyModal.booking,
  close: store.editPropertyModal.close,
  upsertBooking: store.upsertBooking,
});
