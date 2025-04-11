import type {
  Action,
  ActionType,
  Observer,
} from "@/types/event-emitter-types.ts";
import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class EventEmitter implements Injectable {
  public name = ServiceName.EVENT_EMITTER;
  private observers = new Map<string, Observer[]>();

  public subscribe(eventType: ActionType, observer: Observer): void {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }
    const observers = this.observers.get(eventType);
    observers?.push(observer);
  }

  public notify(event: Action): void {
    const observers = this.observers.get(event.type);
    if (observers) {
      for (const observer of observers) {
        observer.update(event);
      }
    }
  }
}
