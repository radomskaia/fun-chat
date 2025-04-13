import { ZERO } from "@/constants/constants.ts";
import type { Injectable } from "@/types/di-container-types";
import { ServiceName } from "@/types/di-container-types";
import type { TypesForValidator } from "@/types/validator-types.ts";
import { ValidatorTypes } from "@/types/validator-types.ts";
import type { LoginData } from "@/types/login-types.ts";

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
    [ValidatorTypes.loginData]: (value: unknown): value is LoginData =>
      this.isLoginData(value),
  };

  // private static isArrayOf<T>(
  //   value: unknown,
  //   check: (item: unknown) => item is T,
  // ): value is T[] {
  //   return Array.isArray(value) && value.every((element) => check(element));
  // }

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

  private isLoginData(value: unknown): value is LoginData {
    if (!(this.isObject(value) && "login" in value && "password" in value)) {
      return false;
    }
    return this.isString(value.login) && this.isString(value.password);
  }
}
