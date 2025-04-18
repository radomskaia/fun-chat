import type { AuthData } from "@/services/auth-service/auth-types.ts";

export enum GlobalStoreKeys {
  USER = "user",
}

export interface State {
  [GlobalStoreKeys.USER]: AuthData | null;
}
