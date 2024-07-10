import { StateCreator } from "zustand";
import { PropertySlice } from "./propertiesSlice";

export type AllSlices = PropertySlice;

export type ImmerStateCreator<T> = StateCreator<AllSlices, [["zustand/immer", never], never], [], T>;