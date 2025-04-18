export enum MessagesStateKeys {
  MESSAGES = "messages",
  NEW_MESSAGE_COUNT = "newMessageCount",
}

export interface MessagesState {
  [MessagesStateKeys.MESSAGES]: Record<string, Message>;
  [MessagesStateKeys.NEW_MESSAGE_COUNT]: Record<string, Message>;
}

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
}
