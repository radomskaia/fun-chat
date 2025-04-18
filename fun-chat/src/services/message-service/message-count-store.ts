import { StoreController } from "@/Store/store-controller.ts";
import type { CountState } from "@/services/message-service/message-types.ts";

export class MessageCountStore extends StoreController<
  CountState,
  keyof CountState
> {
  private static instance: MessageCountStore;
  private constructor(initValue: CountState) {
    super(initValue);
  }

  public static getInstance(): MessageCountStore {
    if (!MessageCountStore.instance) {
      const initValue = {};
      MessageCountStore.instance = new MessageCountStore(initValue);
    }
    return MessageCountStore.instance;
  }
}
