import type { State, StoreCallback } from "@/Store/store-types.ts";
import type { StoreTypes } from "@/Store/store-types.ts";

export class Store {
  public static instance: Store;
  private state: State | null;
  private listeners: StoreCallback[] = [];

  private constructor() {
    this.state = null;
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public init(initialValue: State): void {
    if (this.state) {
      return;
    }
    this.state = structuredClone(initialValue);
  }

  public getState(): State {
    if (!this.state) {
      throw new Error("Store is not initialized");
    }
    return structuredClone(this.state);
  }

  public dispatch<A extends StoreTypes>(type: A, payload: State[A]): void {
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

  public subscribe(listener: StoreCallback): () => void {
    this.listeners.push(listener);
    return () =>
      (this.listeners = this.listeners.filter(
        (callback) => callback !== listener,
      ));
  }
}
