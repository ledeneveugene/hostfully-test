import { create } from "zustand";
import { withZustandards } from "zustand-ards";
import { AllSlices } from "./types";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { propertySlice } from "./propertiesSlice";

const isDev = import.meta.env.MODE === "development";

let useGlobalStore;
if (isDev) {
  console.log("Development mode");

  useGlobalStore = create<AllSlices>()(
    immer(
      devtools((...a) => ({
        ...propertySlice(...a),
      }))
    )
  );
} else {
  useGlobalStore = create<AllSlices>()(
    immer((...a) => ({
      ...propertySlice(...a),
    }))
  );
}

export { useGlobalStore };

export const useGlobalStoreWithZustandards = withZustandards(useGlobalStore);
