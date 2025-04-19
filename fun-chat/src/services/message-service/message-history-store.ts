import type {
  ActionUnionTypes,
  Message,
  MessagesState,
} from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { messageStoreReducer } from "@/services/message-service/message-store-reduser.ts";

export class MessageHistoryStore extends StoreController<
  MessagesState,
  ActionUnionTypes
> {
  private static instance: MessageHistoryStore;
  private constructor(
    initValue: MessagesState,
    reducer: (state: MessagesState, action: ActionUnionTypes) => MessagesState,
  ) {
    super(initValue, reducer);
  }

  public static getInstance(): MessageHistoryStore {
    if (!MessageHistoryStore.instance) {
      const initValue = {
        [MessagesStateKeys.DIALOG_ID]: null,
        [MessagesStateKeys.MESSAGES]: new Map<string, Message>(),
      };
      MessageHistoryStore.instance = new MessageHistoryStore(
        initValue,
        messageStoreReducer,
      );
    }
    return MessageHistoryStore.instance;
  }
}
