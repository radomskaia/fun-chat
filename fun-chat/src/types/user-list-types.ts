import type { RESPONSE_TYPES } from "@/types/websocket-types.ts";

export interface User {
  login: string;
  isLogined: boolean;
}

export type UserState = RESPONSE_TYPES.ACTIVE | RESPONSE_TYPES.INACTIVE;
