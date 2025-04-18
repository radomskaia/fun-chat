import type { StoreCallback } from "@/Store/store-types.ts";

export class Store<S> {
  private state: S;
  private listeners: StoreCallback<S>[] = [];

  public constructor(initialValue: S) {
    this.state = structuredClone(initialValue);
  }

  public getState(): S {
    if (!this.state) {
      throw new Error("Store is not initialized");
    }
    return structuredClone(this.state);
  }

  public dispatch<A extends keyof S>(type: A, payload: S[A]): void {
    if (!this.state) {
      throw new Error("Store is not initialized");
    }

    const previousValue = this.state[type];
    if (JSON.stringify(previousValue) === JSON.stringify(payload)) {
      return;
    }

    this.state = { ...this.state, [type]: payload };
    for (const listener of this.listeners) {
      listener(structuredClone(this.state), type);
    }
  }

  public subscribe(listener: StoreCallback<S>): () => void {
    this.listeners.push(listener);
    return () =>
      (this.listeners = this.listeners.filter(
        (callback) => callback !== listener,
      ));
  }
}
