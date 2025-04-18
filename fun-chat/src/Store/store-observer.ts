import type { Store } from "@/Store/store.ts";
import type { StoreCallback } from "@/Store/store-types.ts";

export class StoreObserver<T> {
  private observers = new Map<keyof T, StoreCallback<T>[]>();

  public constructor(store: Store<T>) {
    store.subscribe((data: Partial<T>, type?: keyof T) => {
      if (type) {
        this.notify(data, type);
      }
    });
  }

  private static validateState<T>(
    state: object,
    data: Partial<T>,
    type: keyof T,
  ): state is Partial<T> {
    const newState = { [type]: data[type] };
    return JSON.stringify(newState) === JSON.stringify(state);
  }

  public subscribe(callback: StoreCallback<T>, type: keyof T): () => void {
    const observers = this.observers.get(type);
    if (observers) {
      observers.push(callback);
    } else {
      this.observers.set(type, [callback]);
    }

    return () => {
      const update = observers?.filter((listener) => callback !== listener);
      if (update) {
        this.observers.set(type, update);
      }
    };
  }

  private notify(data: Partial<T>, type: keyof T): void {
    const state = { [type]: data[type] };
    if (!StoreObserver.validateState(state, data, type)) {
      return;
    }
    const observers = this.observers.get(type);
    if (observers) {
      for (const listener of observers) {
        listener(state);
      }
    }
  }
}
