import type { Store } from "@/Store/store.ts";
import type { StoreCallback } from "@/Store/store-types.ts";

export class StoreObserver<S, A extends { type: string }> {
  private observers = new Map<A["type"], StoreCallback<S, A>[]>();

  public constructor(store: Store<S, A>) {
    store.subscribe((data: S, action?: A) => {
      if (action) {
        this.notify(data, action);
      }
    });
  }

  public subscribe(callback: StoreCallback<S, A>, type: A["type"]): () => void {
    const observers = this.observers.get(type);
    if (observers) {
      observers.push(callback);
    } else {
      this.observers.set(type, [callback]);
    }
    if (type === "dialogId") {
      console.log("subscribe", type, this.observers);
    }
    return () => {
      const update = this.observers
        .get(type)
        ?.filter((listener) => callback !== listener);
      if (update) {
        this.observers.set(type, update);
      }
    };
  }

  private notify(data: S, action: A): void {
    const observers = this.observers.get(action.type);
    if (observers) {
      for (const listener of observers) {
        listener(data, action);
      }
    }
  }
}
