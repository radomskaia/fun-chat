import type { AuthData } from "@/services/auth-service/auth-types.ts";

export enum GlobalStoreTypes {
  USER = "user",
}

export interface State {
  [GlobalStoreTypes.USER]: AuthData | null;
}
