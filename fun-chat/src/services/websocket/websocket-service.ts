import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import {
  API_URL,
  RECONNECT_INTERVAL,
} from "@/services/websocket/websocket-constants.ts";
import { RESPONSE_TYPES } from "@/services/websocket/websocket-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import { ReconnectModal } from "@/components/modal/reconnect-modal.ts";

export class WebSocketService implements Injectable {
  public name = ServiceName.WEBSOCKET;
  private socket: WebSocket;
  private responseActions = new Map<
    string,
    { error?: (error: string) => void; action: (data?: unknown) => void }
  >();
  private diContainer = DIContainer.getInstance();
  private url = API_URL;
  private reconnectModal = new ReconnectModal();
  constructor() {
    this.socket = new WebSocket(this.url);
    this.connect();
  }

  public requestToServer(
    type: RESPONSE_TYPES,
    payload: unknown,
    action?: {
      error: (error: string) => void;
      action: (data?: unknown) => void;
    },
  ): void {
    const id = globalThis.crypto.randomUUID();
    if (action) {
      this.responseActions.set(id, action);
    }
    this.send(id, type, payload);
  }

  public requestFromServer(
    type: RESPONSE_TYPES,
    action: {
      action: (data?: unknown) => void;
    },
  ): void {
    this.responseActions.set(type, action);
  }

  private connect(): void {
    if (this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.url);
      this.reconnectModal.showModal();
    }

    this.socket.addEventListener("open", () => {
      this.diContainer
        .getService(ServiceName.EVENT_EMITTER)
        .notify({ type: ActionType.openSocket });
      this.reconnectModal.close();
    });

    this.socket.addEventListener("close", () => {
      setTimeout(() => {
        this.connect();
      }, RECONNECT_INTERVAL);
    });

    this.socket.addEventListener("message", (event) => {
      this.onMessage(event);
    });
  }

  private send(id: string, type: RESPONSE_TYPES, payload: unknown): void {
    if (this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
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
    if (data.type === RESPONSE_TYPES.ERROR && action?.error) {
      action.error(data.payload.error);
    } else {
      action?.action(data.payload);
    }
  }
}
