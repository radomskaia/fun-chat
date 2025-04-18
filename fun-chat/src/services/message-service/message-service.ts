import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { RESPONSE_TYPES } from "@/services/websocket/websocket-types.ts";
import { MessageHistoryStore } from "@/services/message-service/message-history-store.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import type {
  Message,
  StatusValidatorType,
} from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { MessageCountStore } from "@/services/message-service/message-count-store.ts";
import { ONE } from "@/constants/constants.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import { STATUS_TYPES } from "@/services/message-service/message-constants.ts";

export class MessageService implements Injectable {
  public name = ServiceName.MESSAGE_SERVICE;
  private historyStore = MessageHistoryStore.getInstance();
  private countStore = MessageCountStore.getInstance();
  private websocketService;
  private validator;
  private eventEmitter;

  private readonly messageSubscriptionsConfig = {
    [STATUS_TYPES.READ]: {
      type: RESPONSE_TYPES.READ,
      validator: ValidatorTypes.isReadedStatusPayload,
      actionType: ActionType.updateMessageStatus,
    },
    [STATUS_TYPES.DELIVER]: {
      type: RESPONSE_TYPES.DELIVER,
      validator: ValidatorTypes.isDeliveredStatusPayload,
      actionType: ActionType.updateMessageStatus,
    },
    [STATUS_TYPES.DELETE]: {
      type: RESPONSE_TYPES.DELETE,
      validator: ValidatorTypes.isDeletedStatusPayload,
      actionType: ActionType.updateMessageStatus,
    },
    [STATUS_TYPES.EDIT]: {
      type: RESPONSE_TYPES.EDIT,
      validator: ValidatorTypes.isEditedStatusPayload,
      actionType: ActionType.editMessage,
    },
  } as const;

  constructor() {
    const diContainer = DIContainer.getInstance();

    this.websocketService = diContainer.getService(ServiceName.WEBSOCKET);
    this.validator = diContainer.getService(ServiceName.VALIDATOR);
    this.eventEmitter = diContainer.getService(ServiceName.EVENT_EMITTER);

    this.subscribeToMessages();
  }

  public sendMessage(message: string, recipientLogin: string): void {
    const data = {
      message: {
        to: recipientLogin,
        text: message,
      },
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.MESSAGE, data, {
      action: this.sendMessageHandler.bind(this),
      error: (message: string) => console.error(message),
    });
  }

  public getMessagesHistory(
    recipientLogin: string,
    callback: (data: Message[]) => void,
  ): void {
    this.historyStore.clearStore();
    const data = {
      user: {
        login: recipientLogin,
      },
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.HISTORY, data, {
      action: (data: unknown): void => {
        if (!this.validator.validate(ValidatorTypes.messagesPayload, data)) {
          return;
        }
        callback(data.messages);
      },
      error: (message: string) => console.error(message),
    });
  }

  public changeMessageStatus(
    messageId: string,
    status: keyof typeof STATUS_TYPES,
    callback: (data: Pick<Message, "id" | "status">) => void,
  ): void {
    const data = {
      message: {
        id: messageId,
      },
    };
    this.websocketService.requestToServer(RESPONSE_TYPES[status], data, {
      action: (data: unknown): void => {
        if (!this.validator.validate(ValidatorTypes.messagePayload, data)) {
          return;
        }
        callback(data.message);
      },
      error: (message: string) => console.error(message),
    });
  }

  public setNewMessagesCount(recipientLogin: string): void {
    this.getMessagesHistory(recipientLogin, (data: Message[]): void => {
      const newMessages = data.filter(
        (message: Message) => !message.status.isReaded,
      );
      this.countStore.dispatch(recipientLogin, newMessages.length);
    });
  }

  private sendMessageHandler(data: unknown): void {
    if (!this.validator.validate(ValidatorTypes.messagePayload, data)) {
      return;
    }
    const messageState = this.historyStore.getState(MessagesStateKeys.MESSAGES);
    messageState.set(data.message.id, data.message);
    this.historyStore.dispatch(MessagesStateKeys.MESSAGES, messageState);
  }

  private subscribeToMessages(): void {
    this.websocketService.requestFromServer(RESPONSE_TYPES.MESSAGE, {
      action: this.newMessageHandler.bind(this),
    });

    for (const { type, ...config } of Object.values(
      this.messageSubscriptionsConfig,
    )) {
      this.websocketService.requestFromServer(type, {
        action: (data: unknown) => this.changeStatusHandler(data, config),
      });
    }
  }

  private newMessageHandler(data: unknown): void {
    if (!this.validator.validate(ValidatorTypes.messagePayload, data)) {
      return;
    }
    const messageState = this.historyStore.getState();

    if (data.message.id === messageState[MessagesStateKeys.DIALOG_ID]) {
      messageState[MessagesStateKeys.MESSAGES].set(
        data.message.id,
        data.message,
      );
      this.historyStore.dispatch(
        MessagesStateKeys.MESSAGES,
        messageState[MessagesStateKeys.MESSAGES],
      );
    } else {
      const key = data.message.from;
      const count = this.countStore.getState();
      if (count[key]) {
        this.countStore.dispatch(key, count[key] + ONE);
      } else {
        this.countStore.dispatch(key, ONE);
      }
    }
  }

  private changeStatusHandler(
    data: unknown,
    {
      validator,
      actionType,
    }: { validator: StatusValidatorType; actionType: ActionType },
  ): void {
    if (!this.validator.validate(validator, data)) {
      return;
    }
    const messageState = this.historyStore.getState(MessagesStateKeys.MESSAGES);
    if (!messageState.has(data.message.id)) {
      return;
    }
    this.eventEmitter.notify({
      type: actionType,
      data: data.message,
    });
  }
}
