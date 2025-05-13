import { Store } from "@/Store/store.ts";
import { StoreObserver } from "@/Store/store-observer.ts";
import type { StoreCallback } from "@/Store/store-types.ts";

export abstract class StoreController<S, A extends { type: string }> {
  protected store;
  protected observer;

  protected constructor(initialValue: S, reducer: (state: S, action: A) => S) {
    this.store = new Store<S, A>(initialValue, reducer);
    this.observer = new StoreObserver(this.store);
  }

  public getState(): S;
  public getState<K extends keyof S>(key: K): S[K];
  public getState<K extends keyof S>(key?: K): S | S[K] {
    const state = this.store.getState();
    if (key) {
      return state[key];
    }
    return state;
  }

  public subscribe(
    listener: StoreCallback<S, A>,
    type?: A["type"],
  ): () => void {
    let unsubscribe: () => void;
    unsubscribe = type
      ? this.observer.subscribe(listener, type)
      : this.store.subscribe(listener);
    return unsubscribe;
  }

  public dispatch(option: A): void {
    this.store.dispatch(option);
  }
}
