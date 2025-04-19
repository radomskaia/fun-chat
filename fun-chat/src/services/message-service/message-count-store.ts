import { StoreController } from "@/Store/store-controller.ts";
import type { CountState } from "@/services/message-service/message-types.ts";
import { messageCountStoreReducer } from "@/services/message-service/message-count-reduser.ts";

export class MessageCountStore extends StoreController<
  CountState,
  {
    type: keyof CountState;
    payload: number;
  }
> {
  private static instance: MessageCountStore;
  private constructor(
    initValue: CountState,
    reducer: (
      state: CountState,
      action: { type: keyof CountState; payload: number },
    ) => CountState,
  ) {
    super(initValue, reducer);
  }

  public static getInstance(): MessageCountStore {
    if (!MessageCountStore.instance) {
      const initValue = {};
      MessageCountStore.instance = new MessageCountStore(
        initValue,
        messageCountStoreReducer,
      );
    }
    return MessageCountStore.instance;
  }
}
