import type { AuthData } from "@/services/auth-service/auth-types.ts";
import type {
  UserPayload,
  UsersPayload,
} from "@/services/websocket/websocket-types.ts";
import type {
  Message,
  MessagePayload,
  MessagesPayload,
} from "@/services/message-service/message-types.ts";

export enum ValidatorTypes {
  object = "object",
  string = "string",
  number = "number",
  boolean = "boolean",
  authData = "authData",
  usersPayload = "usersPayload",
  userPayload = "userPayload",
  message = "message",
  messagePayload = "messagePayload",
  messagesPayload = "messagesPayload",
  isReadedStatusPayload = "isReadedStatusPayload",
  isDeliveredStatusPayload = "isDeliveredStatusPayload",
  isEditedStatusPayload = "isEditedStatusPayload",
  isDeletedStatusPayload = "isDeletedStatusPayload",
}

export interface TypesForValidator {
  [ValidatorTypes.object]: object;
  [ValidatorTypes.string]: string;
  [ValidatorTypes.number]: number;
  [ValidatorTypes.boolean]: boolean;
  [ValidatorTypes.authData]: AuthData;
  [ValidatorTypes.usersPayload]: UsersPayload;
  [ValidatorTypes.userPayload]: UserPayload;
  [ValidatorTypes.message]: Message;
  [ValidatorTypes.messagePayload]: MessagePayload<Message>;
  [ValidatorTypes.messagesPayload]: MessagesPayload;
  [ValidatorTypes.isReadedStatusPayload]: MessagePayload<
    Pick<Message, "id" | "status">
  >;
  [ValidatorTypes.isDeliveredStatusPayload]: MessagePayload<
    Pick<Message, "id" | "status">
  >;
  [ValidatorTypes.isEditedStatusPayload]: MessagePayload<
    Pick<Message, "id" | "status" | "text">
  >;
  [ValidatorTypes.isDeletedStatusPayload]: MessagePayload<
    Pick<Message, "id" | "status">
  >;
}
