import type { State, StoreCallback, StoreTypes } from "@/Store/store-types.ts";
import { Store } from "@/Store/store.ts";

export class StoreObserver {
  public static instance: StoreObserver;
  private observers = new Map<StoreTypes, StoreCallback[]>();
  constructor() {
    Store.getInstance().subscribe((data: Partial<State>, type?: StoreTypes) => {
      if (type) {
        this.notify(data, type);
      }
    });
  }

  public static getInstance(): StoreObserver {
    if (!StoreObserver.instance) {
      StoreObserver.instance = new StoreObserver();
    }
    return StoreObserver.instance;
  }

  public subscribe(callback: StoreCallback, type: StoreTypes): () => void {
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

  private notify(data: Partial<State>, type: StoreTypes): void {
    const state = { [type]: data[type] };
    const observers = this.observers.get(type);
    if (observers) {
      for (const listener of observers) {
        listener(state);
      }
    }
  }
}
