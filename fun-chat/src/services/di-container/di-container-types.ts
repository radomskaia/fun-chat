import type { SessionStorage } from "@/services/session-storage/session-storage.ts";
import type { Router } from "@/services/router/router.ts";
import type { EventEmitter } from "@/services/event-emitter/event-emitter.ts";
import type { Validator } from "@/services/validator/validator.ts";
import type { WebSocketService } from "@/services/websocket/websocket-service.ts";
import type { AuthService } from "@/services/auth-service/auth-service.ts";
import type { MessageService } from "@/services/message-service/message-service.ts";

export interface Injectable {
  name: ServiceName;
}

export enum ServiceName {
  ROUTER = "router",
  EVENT_EMITTER = "eventEmitter",
  STORAGE = "sessionStorage",
  VALIDATOR = "validator",
  WEBSOCKET = "WebSocketService",
  USER_SERVICE = "LoginService",
  MESSAGE_SERVICE = "MessageService",
}

export interface ServiceMap {
  [ServiceName.ROUTER]: Router;
  [ServiceName.EVENT_EMITTER]: EventEmitter;
  [ServiceName.STORAGE]: SessionStorage;
  [ServiceName.VALIDATOR]: Validator;
  [ServiceName.WEBSOCKET]: WebSocketService;
  [ServiceName.USER_SERVICE]: AuthService;
  [ServiceName.MESSAGE_SERVICE]: MessageService;
}
