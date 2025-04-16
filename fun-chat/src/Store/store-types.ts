import type { LoginData } from "@/types/login-types.ts";

export enum StoreTypes {
  USER = "user",
}

export interface State {
  [StoreTypes.USER]: LoginData | null;
}

export type StoreCallback = (state: Partial<State>, type?: StoreTypes) => void;
