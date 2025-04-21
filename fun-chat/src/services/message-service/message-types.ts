import type { ValidatorTypes } from "@/services/validator/validator-types.ts";
import type { User } from "@/types/user-list-types.ts";

export enum MessagesStateKeys {
  DIALOG_ID = "dialogId",
  MESSAGES = "messages",
}

export interface MessagesState {
  [MessagesStateKeys.DIALOG_ID]: User | null;
  [MessagesStateKeys.MESSAGES]: Map<string, Message>;
}

export enum MessagesStateActions {
  SET_DIALOG_ID = "setDialogId",
  SET_MESSAGES = "setMessages",
  ADD_MESSAGE = "addMessage",
  DELETE_MESSAGE = "deleteMessage",
  EDIT_MESSAGE = "editMessage",
  DELIVER_MESSAGE = "deliverMessage",
  READED_MESSAGE = "readedMessage",
  CLEAR_DIALOG = "clearDialog",
}

export interface PayloadTypes {
  [MessagesStateActions.SET_DIALOG_ID]: User | null;
  [MessagesStateActions.SET_MESSAGES]: Message[];
  [MessagesStateActions.ADD_MESSAGE]: [string, Message];
  [MessagesStateActions.DELETE_MESSAGE]: string;
  [MessagesStateActions.EDIT_MESSAGE]: MessagePayload<
    Pick<Message, "id" | "status" | "text">
  >;
  [MessagesStateActions.DELIVER_MESSAGE]: MessagePayload<
    Pick<Message, "id" | "status">
  >;
  [MessagesStateActions.READED_MESSAGE]: MessagePayload<
    Pick<Message, "id" | "status">
  >;
  [MessagesStateActions.CLEAR_DIALOG]: [];
}

export type ActionUnionTypes = {
  [K in keyof PayloadTypes]: {
    type: K;
    payload: PayloadTypes[K];
  };
}[keyof PayloadTypes];

export type CountState = Record<string, number>;

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
  isDeleted?: boolean;
}

export interface MessagePayload<T> {
  message: T;
}
export interface MessagesPayload {
  messages: Message[];
}

export type StatusValidatorType =
  | {
      validator: ValidatorTypes.isReadedStatusPayload;
      actionType: MessagesStateActions.READED_MESSAGE;
    }
  | {
      validator: ValidatorTypes.isEditedStatusPayload;
      actionType: MessagesStateActions.EDIT_MESSAGE;
    }
  | {
      validator: ValidatorTypes.isDeletedStatusPayload;
      actionType: MessagesStateActions.DELETE_MESSAGE;
    }
  | {
      validator: ValidatorTypes.isDeliveredStatusPayload;
      actionType: MessagesStateActions.DELIVER_MESSAGE;
    };
