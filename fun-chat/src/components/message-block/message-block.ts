import type { Component } from "@/services/router/router-type.ts";
import { MessageBlockView } from "@/components/message-block/message-block-view.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { MessageHistoryStore } from "@/services/message-service/message-store/message-history-store.ts";
import {
  MessagesStateActions,
  MessagesStateKeys,
} from "@/services/message-service/message-types.ts";
import { ONE } from "@/constants/constants.ts";
import type { User } from "@/types/user-list-types.ts";

export class MessageBlock implements Component {
  private readonly view;
  private messageService = DIContainer.getInstance().getService(
    ServiceName.MESSAGE_SERVICE,
  );
  private isRead = false;

  constructor() {
    this.view = new MessageBlockView();
    const historyStore = MessageHistoryStore.getInstance();

    historyStore.subscribe((state) => {
      if (state.dialogId) {
        this.onOpenChat(state.dialogId);
      }
    }, MessagesStateActions.SET_DIALOG_ID);

    historyStore.subscribe((_, action) => {
      if (
        !action?.payload ||
        action.type !== MessagesStateActions.ADD_MESSAGE
      ) {
        return;
      }
      const message = action.payload[ONE];
      this.view.addMessage(message);
      this.view.scrollToBottom();
      if (this.isRead) {
        this.messageService.changeMessageStatus(message.id, "READ");
      }
    }, MessagesStateActions.ADD_MESSAGE);

    this.view.getElement().addEventListener("click", () => {
      if (this.isRead) {
        return;
      }
      const state = historyStore.getState();
      for (const item of state[MessagesStateKeys.MESSAGES]) {
        const message = item[ONE];
        if (
          state[MessagesStateKeys.DIALOG_ID] &&
          message.from === state[MessagesStateKeys.DIALOG_ID].login &&
          !message.status.isReaded
        ) {
          this.messageService.changeMessageStatus(message.id, "READ");
        }
      }
    });
  }

  public getElement(): HTMLDivElement {
    return this.view.getElement();
  }

  private onOpenChat(user: User): void {
    this.isRead = false;
    this.view.createBlock(user, (event: SubmitEvent) => {
      event.preventDefault();
      const data = this.view.getFormData();
      this.messageService.sendMessage(data, user.login);
    });

    this.messageService.getMessagesHistory(user.login, (data) => {
      this.view.addMessages(data);
      this.view.scrollToBottom();
    });
  }
}
