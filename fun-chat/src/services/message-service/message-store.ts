import type { MessagesState } from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { Store } from "@/Store/store.ts";
import { StoreObserver } from "@/Store/store-observer.ts";

export class MessageStore extends StoreController<
  MessagesState,
  MessagesStateKeys
> {
  private static instance: MessageStore;
  private constructor(initValue: MessagesState) {
    super(initValue);
  }

  public static getInstance(): MessageStore {
    if (!MessageStore.instance) {
      const initValue = {
        [MessagesStateKeys.MESSAGES]: {},
        [MessagesStateKeys.NEW_MESSAGE_COUNT]: {},
      };
      MessageStore.instance = new MessageStore(initValue);
    }
    return MessageStore.instance;
  }

  public clearStore(): void {
    const initValue = {
      [MessagesStateKeys.MESSAGES]: {},
      [MessagesStateKeys.NEW_MESSAGE_COUNT]: {},
    };
    this.store = new Store<MessagesState>(initValue);
    this.observer = new StoreObserver(this.store);
  }
}
