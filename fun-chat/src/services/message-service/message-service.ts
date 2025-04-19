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
import { MessagesStateActions } from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { MessageCountStore } from "@/services/message-service/message-count-store.ts";
import { EMPTY_STRING, ONE } from "@/constants/constants.ts";
import { STATUS_TYPES } from "@/services/message-service/message-constants.ts";

export class MessageService implements Injectable {
  public name = ServiceName.MESSAGE_SERVICE;
  private historyStore = MessageHistoryStore.getInstance();
  private countStore = MessageCountStore.getInstance();
  private websocketService;
  private validator;

  private readonly messageSubscriptionsConfig = {
    [STATUS_TYPES.READ]: {
      type: RESPONSE_TYPES.READ,
      config: {
        validator: ValidatorTypes.isReadedStatusPayload,
        actionType: MessagesStateActions.READED_MESSAGE,
      },
    },
    [STATUS_TYPES.DELIVER]: {
      type: RESPONSE_TYPES.DELIVER,
      config: {
        validator: ValidatorTypes.isDeliveredStatusPayload,
        actionType: MessagesStateActions.DELIVER_MESSAGE,
      },
    },
    [STATUS_TYPES.DELETE]: {
      type: RESPONSE_TYPES.DELETE,
      config: {
        validator: ValidatorTypes.isDeletedStatusPayload,
        actionType: MessagesStateActions.DELETE_MESSAGE,
      },
    },
    [STATUS_TYPES.EDIT]: {
      type: RESPONSE_TYPES.EDIT,
      config: {
        validator: ValidatorTypes.isEditedStatusPayload,
        actionType: MessagesStateActions.EDIT_MESSAGE,
      },
    },
  } as const;

  constructor() {
    const diContainer = DIContainer.getInstance();

    this.websocketService = diContainer.getService(ServiceName.WEBSOCKET);
    this.validator = diContainer.getService(ServiceName.VALIDATOR);

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
    this.historyStore.dispatch({
      type: MessagesStateActions.CLEAR_DIALOG,
      payload: [],
    });
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
      this.countStore.dispatch({
        type: recipientLogin,
        payload: newMessages.length,
      });
    });
  }

  private sendMessageHandler(data: unknown): void {
    if (!this.validator.validate(ValidatorTypes.messagePayload, data)) {
      return;
    }
    this.historyStore.dispatch({
      type: MessagesStateActions.ADD_MESSAGE,
      payload: [data.message.id, data.message],
    });
  }

  private newMessageHandler(data: unknown): void {
    if (!this.validator.validate(ValidatorTypes.messagePayload, data)) {
      return;
    }
    const messageState = this.historyStore.getState();
    if (data.message.from === messageState[MessagesStateKeys.DIALOG_ID]) {
      this.historyStore.dispatch({
        type: MessagesStateActions.ADD_MESSAGE,
        payload: [data.message.id, data.message],
      });
    } else {
      const key = data.message.from;
      const count = this.countStore.getState();
      if (count[key]) {
        this.countStore.dispatch({ type: key, payload: count[key] + ONE });
      } else {
        this.countStore.dispatch({ type: key, payload: ONE });
      }
    }
  }

  private subscribeToMessages(): void {
    this.websocketService.requestFromServer(RESPONSE_TYPES.MESSAGE, {
      action: this.newMessageHandler.bind(this),
    });

    for (const { type, ...config } of Object.values(
      this.messageSubscriptionsConfig,
    )) {
      this.websocketService.requestFromServer(type, {
        action: (data: unknown) =>
          this.changeStatusHandler(data, config.config),
      });
    }
  }

  private changeStatusHandler(
    data: unknown,
    { validator, actionType }: StatusValidatorType,
  ): void {
    if (!this.validator.validate(validator, data)) {
      return;
    }
    const messageState = this.historyStore.getState(MessagesStateKeys.MESSAGES);

    if (!messageState.has(data.message.id)) {
      return;
    }

    if (actionType === MessagesStateActions.DELETE_MESSAGE) {
      this.historyStore.dispatch({
        type: MessagesStateActions.DELETE_MESSAGE,
        payload: data.message.id,
      });
      return;
    }

    if (actionType === MessagesStateActions.EDIT_MESSAGE) {
      this.historyStore.dispatch({
        type: MessagesStateActions.EDIT_MESSAGE,
        payload: {
          message: {
            id: data.message.id,
            status: data.message.status,
            text: "text" in data.message ? data.message.text : EMPTY_STRING,
          },
        },
      });
      return;
    }

    this.historyStore.dispatch({
      type: actionType,
      payload: data,
    });
  }
}
