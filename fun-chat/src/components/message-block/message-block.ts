import type { Component } from "@/services/router/router-type.ts";
import { MessageBlockView } from "@/components/message-block/message-block-view.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type {
  Action,
  Observer,
} from "@/services/event-emitter/event-emitter-types.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
// import { MessageHistoryStore } from "@/services/message-service/message-history-store.ts";
// import { MessagesStateKeys } from "@/services/message-service/message-types.ts";

export class MessageBlock implements Component, Observer {
  private view;
  private eventEmitter = DIContainer.getInstance().getService(
    ServiceName.EVENT_EMITTER,
  );
  private messageService = DIContainer.getInstance().getService(
    ServiceName.MESSAGE_SERVICE,
  );
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );

  constructor() {
    this.view = new MessageBlockView();

    this.eventEmitter.subscribe(ActionType.openChat, this);
    // MessageHistoryStore.getInstance().subscribe(() => {
    //   const messages = MessageHistoryStore.getInstance().getState();
    //   this.view.addMessages(messages[MessagesStateKeys.MESSAGES]);
    // });
  }

  public update(event: Action): void {
    if (
      !(
        event.type === ActionType.openChat &&
        this.validator.validate(ValidatorTypes.string, event.data)
      )
    ) {
      return;
    }
    const login = event.data;
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

  public getElement(): HTMLDivElement {
    return this.view.getElement();
  }
}
