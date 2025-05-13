import { LS_PREFIX } from "@/constants/constants.ts";
import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type {
  ValidatorTypes,
  TypesForValidator,
} from "@/services/validator/validator-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";

export class SessionStorage implements Injectable {
  public name = ServiceName.STORAGE;
  private readonly prefix = LS_PREFIX;
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );

  public save(key: string, value: unknown): void {
    const storageKey = this.prefix + key;
    globalThis.sessionStorage.setItem(storageKey, JSON.stringify(value));
  }

  public load<T extends ValidatorTypes>(
    key: string,
    typeName: T,
  ): TypesForValidator[T] | null {
    const storageKey = this.prefix + key;
    const value = globalThis.sessionStorage.getItem(storageKey);
    if (!value) {
      return null;
    }
    try {
      const result = JSON.parse(value);
      if (this.validator.validate(typeName, result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }

  public remove(key: string): void {
    const storageKey = this.prefix + key;
    globalThis.sessionStorage.removeItem(storageKey);
  }
}
