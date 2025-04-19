import type { Store } from "@/Store/store.ts";
import type { StoreCallback } from "@/Store/store-types.ts";

export class StoreObserver<S, A extends { type: string }> {
  private observers = new Map<A["type"], StoreCallback<S, A["type"]>[]>();

  public constructor(store: Store<S, A>) {
    store.subscribe((data: S, type?: A["type"]) => {
      if (type) {
        this.notify(data, type);
      }
    });
  }

  public subscribe(
    callback: StoreCallback<S, A["type"]>,
    type: A["type"],
  ): () => void {
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

  private notify(data: S, type: A["type"]): void {
    const observers = this.observers.get(type);
    if (observers) {
      for (const listener of observers) {
        listener(data);
      }
    }
  }
}
