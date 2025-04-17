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

export class Validator implements Injectable {
  public name = ServiceName.VALIDATOR;
  private privateTypes = {
    object: ValidatorTypes.object,
    string: ValidatorTypes.string,
    number: ValidatorTypes.number,
    boolean: ValidatorTypes.boolean,
  };

  private typesConfig = {
    [ValidatorTypes.object]: (value: unknown): value is object =>
      this.isObject(value),
    [ValidatorTypes.string]: (value: unknown): value is string =>
      this.isString(value),
    [ValidatorTypes.number]: (value: unknown): value is number =>
      this.isNumber(value),
    [ValidatorTypes.positiveNumber]: (value: unknown): value is number =>
      this.isPositiveNumber(value),
    [ValidatorTypes.boolean]: (value: unknown): value is boolean =>
      this.isBoolean(value),
    [ValidatorTypes.authData]: (value: unknown): value is AuthData =>
      this.isAuthData(value),
    [ValidatorTypes.user]: (value: unknown): value is User =>
      this.isUserData(value),
    [ValidatorTypes.usersPayload]: (value: unknown): value is UsersPayload =>
      this.isUsersPayload(value),
    [ValidatorTypes.userPayload]: (value: unknown): value is UserPayload =>
      this.isUserPayload(value),
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

  private isUsersPayload(value: unknown): value is UserPayload {
    if (!(this.isObject(value) && "users" in value)) {
      return false;
    }
    return Validator.isArrayOf(value.users, this.isUserData.bind(this));
  }
}
