import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { TYPES } from "@/constants/websocket-constants.ts";
import { API_URL } from "@/constants/websocket-constants.ts";

export class WebSocketService implements Injectable {
  public name = ServiceName.WEBSOCKET;
  private socket: WebSocket;
  private responseActions = new Map<
    string,
    { error?: (error: string) => void; action: (data?: unknown) => void }
  >();
  private url = API_URL;
  constructor() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("message", (event) => {
      this.onMessage(event);
    });
  }

  public requestToServer(
    type: TYPES,
    payload: unknown,
    action: {
      error: (error: string) => void;
      action: (data?: unknown) => void;
    },
  ): void {
    const id = globalThis.crypto.randomUUID();
    this.responseActions.set(id, action);
    this.send(id, type, payload);
  }

  public requestFromServer(
    type: TYPES,
    action: {
      action: (data?: unknown) => void;
    },
  ): void {
    this.responseActions.set(type, action);
  }

  private send(id: string, type: TYPES, payload: unknown): void {
    const data = {
      id: id,
      type: type,
      payload: payload,
    };
    this.socket.send(JSON.stringify(data));
  }

  private onMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data);
    let id: string;
    id = data.id || data.type;
    const action = this.responseActions.get(id);
    if (data.type === TYPES.ERROR && action?.error) {
      action.error(data.payload.error);
    } else {
      action?.action(data.payload.data);
    }
  }
}
