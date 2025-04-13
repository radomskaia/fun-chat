import type { SessionStorage } from "@/services/session-storage.ts";
import type { Router } from "@/services/router.ts";
import type { EventEmitter } from "@/services/event-emitter.ts";
import type { Validator } from "@/services/validator.ts";
import type { WebSocketService } from "@/services/websocket-service.ts";
import type { LoginService } from "@/services/login-service.ts";

export interface Injectable {
  name: ServiceName;
}

export enum ServiceName {
  ROUTER = "router",
  EVENT_EMITTER = "eventEmitter",
  STORAGE = "sessionStorage",
  VALIDATOR = "validator",
  WEBSOCKET = "WebSocketService",
  LOGIN_SERVICE = "LoginService",
}

export interface ServiceMap {
  [ServiceName.ROUTER]: Router;
  [ServiceName.EVENT_EMITTER]: EventEmitter;
  [ServiceName.STORAGE]: SessionStorage;
  [ServiceName.VALIDATOR]: Validator;
  [ServiceName.WEBSOCKET]: WebSocketService;
  [ServiceName.LOGIN_SERVICE]: LoginService;
}
