import { ZERO } from "@/constants/constants.ts";
import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type { TypesForValidator } from "@/services/validator/validator-types.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import type { AuthData } from "@/services/auth-service/auth-types.ts";
import type { User } from "@/types/user-list-types.ts";
import type {
  UserPayload,
  UsersPayload,
} from "@/services/websocket/websocket-types.ts";
import type {
  Message,
  MessagePayload,
  MessagesPayload,
  MessageStatus,
} from "@/services/message-service/message-types.ts";

export class Validator implements Injectable {
  public name = ServiceName.VALIDATOR;
  private privateTypes = {
    object: ValidatorTypes.object,
    string: ValidatorTypes.string,
    number: ValidatorTypes.number,
    boolean: ValidatorTypes.boolean,
  };

  private typesConfig = {
    [ValidatorTypes.object]: this.isObject.bind(this),
    [ValidatorTypes.string]: this.isString.bind(this),
    [ValidatorTypes.number]: this.isNumber.bind(this),
    [ValidatorTypes.boolean]: this.isBoolean.bind(this),
    [ValidatorTypes.authData]: this.isAuthData.bind(this),
    [ValidatorTypes.usersPayload]: this.isUsersPayload.bind(this),
    [ValidatorTypes.userPayload]: this.isUserPayload.bind(this),
    [ValidatorTypes.message]: this.isMessage.bind(this),
    [ValidatorTypes.messagePayload]: this.isMessagePayload.bind(this),
    [ValidatorTypes.messagesPayload]: this.isMessagesPayload.bind(this),
    [ValidatorTypes.isReadedStatusPayload]:
      this.isReadedStatusPayload.bind(this),
    [ValidatorTypes.isDeliveredStatusPayload]:
      this.isDeliveredStatusPayload.bind(this),
    [ValidatorTypes.isEditedStatusPayload]:
      this.isEditedStatusPayload.bind(this),
    [ValidatorTypes.isDeletedStatusPayload]:
      this.isDeletedStatusPayload.bind(this),
  };

  private static isArrayOf<T>(
    value: unknown,
    check: (item: unknown) => item is T,
  ): value is T[] {
    return Array.isArray(value) && value.every((element) => check(element));
  }

  public validate<T extends ValidatorTypes>(
    typeName: T,
    value: unknown,
  ): value is TypesForValidator[T] {
    return this.typesConfig[typeName](value);
  }

  private isObject(value: unknown): value is object {
    return typeof value === this.privateTypes.object && value !== null;
  }

  private isString(value: unknown): value is string {
    return typeof value === this.privateTypes.string;
  }

  private isNumber(value: unknown): value is number {
    return typeof value === this.privateTypes.number;
  }

  private isBoolean(value: unknown): value is boolean {
    return typeof value === this.privateTypes.boolean;
  }

  private isPositiveNumber(value: unknown): value is number {
    return this.isNumber(value) && value >= ZERO;
  }

  private isAuthData(value: unknown): value is AuthData {
    if (!(this.isObject(value) && "login" in value && "password" in value)) {
      return false;
    }
    return this.isString(value.login) && this.isString(value.password);
  }

  private isUserData(value: unknown): value is User {
    if (!(this.isObject(value) && "login" in value && "isLogined" in value)) {
      return false;
    }
    return this.isString(value.login) && this.isBoolean(value.isLogined);
  }

  private isUserPayload(value: unknown): value is UserPayload {
    if (!(this.isObject(value) && "user" in value)) {
      return false;
    }
    return this.isUserData(value.user);
  }

  private isUsersPayload(value: unknown): value is UsersPayload {
    if (!(this.isObject(value) && "users" in value)) {
      return false;
    }
    return Validator.isArrayOf(value.users, this.isUserData.bind(this));
  }

  private isMessage(value: unknown): value is Message {
    if (
      !(
        this.isObject(value) &&
        "id" in value &&
        "from" in value &&
        "to" in value &&
        "text" in value &&
        "datetime" in value &&
        "status" in value
      )
    ) {
      return false;
    }
    const isString = [value.id, value.from, value.to, value.text];
    return (
      isString.every(this.isString.bind(this)) &&
      this.isPositiveNumber(value.datetime) &&
      this.isMessageStatus(value.status)
    );
  }

  private isReadedStatusPayload(
    value: unknown,
  ): value is MessagePayload<Pick<Message, "id" | "status">> {
    return this.isStatusPayload(value) && this.isReadedStatus(value.status);
  }

  private isDeliveredStatusPayload(
    value: unknown,
  ): value is MessagePayload<Pick<Message, "id" | "status">> {
    return this.isStatusPayload(value) && this.isDeliveredStatus(value.status);
  }

  private isDeletedStatusPayload(
    value: unknown,
  ): value is MessagePayload<Pick<Message, "id" | "status">> {
    return this.isStatusPayload(value) && this.isDeletedStatus(value.status);
  }
  private isEditedStatusPayload(
    value: unknown,
  ): value is MessagePayload<Pick<Message, "id" | "status" | "text">> {
    return (
      this.isStatusPayload(value) &&
      this.isEditedStatus(value.status) &&
      "text" in value &&
      this.isString(value.text)
    );
  }

  private isStatusPayload(
    value: unknown,
  ): value is Pick<Message, "id" | "status"> {
    if (!(this.isObject(value) && "message" in value)) {
      return false;
    }
    if (!(this.isObject(value.message) && "status" in value.message)) {
      return false;
    }

    return this.isMessageStatus(value.message.status);
  }

  private isMessageStatus(value: unknown): value is MessageStatus {
    return (
      this.isReadedStatus(value) &&
      this.isDeliveredStatus(value) &&
      this.isEditedStatus(value)
    );
  }

  private isReadedStatus(
    value: unknown,
  ): value is Pick<MessageStatus, "isReaded"> {
    if (!(this.isObject(value) && "isReaded" in value)) {
      return false;
    }
    return this.isBoolean(value.isReaded);
  }
  private isDeletedStatus(
    value: unknown,
  ): value is Pick<MessageStatus, "isDeleted"> {
    if (!(this.isObject(value) && "isDeleted" in value)) {
      return false;
    }
    return this.isBoolean(value.isDeleted);
  }

  private isDeliveredStatus(
    value: unknown,
  ): value is Pick<MessageStatus, "isDelivered"> {
    if (!(this.isObject(value) && "isDelivered" in value)) {
      return false;
    }
    return this.isBoolean(value.isDelivered);
  }
  private isEditedStatus(
    value: unknown,
  ): value is Pick<MessageStatus, "isEdited"> {
    if (!(this.isObject(value) && "isEdited" in value)) {
      return false;
    }
    return this.isBoolean(value.isEdited);
  }

  private isMessagePayload(value: unknown): value is MessagesPayload {
    if (!(this.isObject(value) && "message" in value)) {
      return false;
    }
    return this.isMessage(value.message);
  }

  private isMessagesPayload(
    value: unknown,
  ): value is MessagePayload<Message[]> {
    if (!(this.isObject(value) && "messages" in value)) {
      return false;
    }
    return Validator.isArrayOf(value.messages, this.isMessage.bind(this));
  }
}
