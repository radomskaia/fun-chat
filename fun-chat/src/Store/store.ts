import type { StoreCallback } from "@/Store/store-types.ts";

export class Store<S, A extends { type: string }> {
  private state: S;
  private readonly reducer;
  private listeners: StoreCallback<S, A["type"]>[] = [];

  public constructor(initialValue: S, reducer: (state: S, action: A) => S) {
    this.state = structuredClone(initialValue);
    this.reducer = reducer;
  }

  public getState(): S {
    return structuredClone(this.state);
  }

  public dispatch(action: A): void {
    this.state = this.reducer(this.state, action);
    for (const listener of this.listeners) {
      listener(structuredClone(this.state), action.type);
    }
  }

  public subscribe(listener: StoreCallback<S, A["type"]>): () => void {
    this.listeners.push(listener);
    return () =>
      (this.listeners = this.listeners.filter(
        (callback) => callback !== listener,
      ));
  }
}
