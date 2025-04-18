import type { ValidatorTypes } from "@/services/validator/validator-types.ts";

export enum MessagesStateKeys {
  DIALOG_ID = "dialogId",
  MESSAGES = "messages",
}

export interface MessagesState {
  [MessagesStateKeys.DIALOG_ID]: string | null;
  [MessagesStateKeys.MESSAGES]: Map<string, Message>;
}

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
  | ValidatorTypes.isReadedStatusPayload
  | ValidatorTypes.isEditedStatusPayload
  | ValidatorTypes.isDeletedStatusPayload
  | ValidatorTypes.isDeliveredStatusPayload;
