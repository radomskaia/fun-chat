import type { CountState } from "@/services/message-service/message-types.ts";

export function messageCountStoreReducer<K extends keyof CountState>(
  state: CountState,
  action: { type: K; payload: CountState[K] },
): CountState {
  return { ...state, [action.type]: action.payload };
}
