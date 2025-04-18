import { Store } from "@/Store/store.ts";
import { StoreObserver } from "@/Store/store-observer.ts";
import type { StoreCallback } from "@/Store/store-types.ts";

export abstract class StoreController<S, K extends keyof S> {
  protected store;
  protected observer;

  protected constructor(initialValue: S) {
    this.store = new Store<S>(initialValue);
    this.observer = new StoreObserver(this.store);
  }

  public getState(): S;
  public getState<A extends K>(type: A): S[A];
  public getState<A extends K>(type?: A): S | S[A] {
    const state = this.store.getState();
    if (type) {
      return state[type];
    }
    return this.store.getState();
  }

  public subscribe(listener: StoreCallback<S>, type?: K): () => void {
    let unsubscribe: () => void;
    unsubscribe = type
      ? this.observer.subscribe(listener, type)
      : this.store.subscribe(listener);
    return unsubscribe;
  }

  public dispatch<A extends K>(type: A, payload: S[A]): void {
    this.store.dispatch(type, payload);
  }
}
