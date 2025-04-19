import type {
  GlobalStoreKeys,
  State,
} from "@/Store/global-store/global-store-types.ts";

export function globalStoreReducer<K extends GlobalStoreKeys>(
  state: State,
  action: { type: K; payload: State[K] },
): State {
  return { ...state, [action.type]: action.payload };
}
