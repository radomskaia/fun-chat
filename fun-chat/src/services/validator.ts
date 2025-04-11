import { ZERO } from "@/constants/constants.ts";
import type { Injectable } from "@/types/di-container-types";
import { ServiceName } from "@/types/di-container-types";
import type { TypesForValidator } from "@/types/validator-types.ts";
import { TypeNames } from "@/types/validator-types.ts";

export class Validator implements Injectable {
  public name = ServiceName.VALIDATOR;
  private privateTypes = {
    object: TypeNames.object,
    string: TypeNames.string,
    number: TypeNames.number,
    boolean: TypeNames.boolean,
  };

  private typesConfig = {
    [TypeNames.object]: (value: unknown): value is object =>
      this.isObject(value),
    [TypeNames.string]: (value: unknown): value is string =>
      this.isString(value),
    [TypeNames.number]: (value: unknown): value is number =>
      this.isNumber(value),
    [TypeNames.positiveNumber]: (value: unknown): value is number =>
      this.isPositiveNumber(value),
    [TypeNames.boolean]: (value: unknown): value is boolean =>
      this.isBoolean(value),
  };

  // private static isArrayOf<T>(
  //   value: unknown,
  //   check: (item: unknown) => item is T,
  // ): value is T[] {
  //   return Array.isArray(value) && value.every((element) => check(element));
  // }

  public validate<T extends TypeNames>(
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
}
