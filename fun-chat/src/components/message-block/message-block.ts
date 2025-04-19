import type { Component } from "@/services/router/router-type.ts";
import { MessageBlockView } from "@/components/message-block/message-block-view.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { MessageHistoryStore } from "@/services/message-service/message-history-store.ts";
import {
  MessagesStateActions,
  MessagesStateKeys,
} from "@/services/message-service/message-types.ts";

export class MessageBlock implements Component {
  private readonly view;
  private messageService = DIContainer.getInstance().getService(
    ServiceName.MESSAGE_SERVICE,
  );

  constructor() {
    this.view = new MessageBlockView();
    const historyStore = MessageHistoryStore.getInstance();

    historyStore.subscribe((state) => {
      if (state.dialogId) {
        this.onOpenChat(state.dialogId);
      }
    }, MessagesStateActions.SET_DIALOG_ID);

    historyStore.subscribe((store) => {
      const message = store[MessagesStateKeys.MESSAGES].values().next().value;
      if (!message) {
        return;
      }
      this.view.addMessages([message]);
    }, MessagesStateActions.ADD_MESSAGE);
  }

  public getElement(): HTMLDivElement {
    return this.view.getElement();
  }

  private onOpenChat(login: string): void {
    this.view.createBlock(login, (event: SubmitEvent) => {
      event.preventDefault();
      const data = this.view.getFormData();
      this.messageService.sendMessage(data, login);
    });

    this.messageService.getMessagesHistory(
      login,
      this.view.addMessages.bind(this.view),
    );
  }
}
