import type { AuthData } from "@/types/login-types.ts";

export enum StoreTypes {
  USER = "user",
}

export interface State {
  [StoreTypes.USER]: AuthData | null;
}

export type StoreCallback = (state: Partial<State>, type?: StoreTypes) => void;
