import { WritableDraft } from "immer";
import { AllSlices } from "../../../store/types";

export const propertySelector = (store: WritableDraft<AllSlices>) => ({
  booking: store.editPropertyModal.booking,
  close: store.editPropertyModal.close,
  open: store.editPropertyModal.open,
  opened: store.editPropertyModal.opened,
  name: store.property.name,
  address: store.property.address,
  review: store.property.review,
  imageURL: store.property.imageURL,
  rating: store.property.rating,
  dailyPrice: store.property.dailyPrice,
});
