import type {
  Message,
  MessagesState,
} from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { Store } from "@/Store/store.ts";
import { StoreObserver } from "@/Store/store-observer.ts";

export class MessageHistoryStore extends StoreController<
  MessagesState,
  MessagesStateKeys
> {
  private static instance: MessageHistoryStore;
  private constructor(initValue: MessagesState) {
    super(initValue);
  }

  public static getInstance(): MessageHistoryStore {
    if (!MessageHistoryStore.instance) {
      const initValue = {
        [MessagesStateKeys.DIALOG_ID]: null,
        [MessagesStateKeys.MESSAGES]: new Map<string, Message>(),
      };
      MessageHistoryStore.instance = new MessageHistoryStore(initValue);
    }
    return MessageHistoryStore.instance;
  }

  public clearStore(): void {
    const initValue = {
      [MessagesStateKeys.DIALOG_ID]: null,
      [MessagesStateKeys.MESSAGES]: new Map<string, Message>(),
    };
    this.store = new Store<MessagesState>(initValue);
    this.observer = new StoreObserver(this.store);
  }
}
