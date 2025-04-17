import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { Router } from "@/services/router/router.ts";
import { EventEmitter } from "@/services/event-emitter/event-emitter.ts";
import { SessionStorage } from "@/services/session-storage/session-storage.ts";
import { Validator } from "@/services/validator/validator.ts";
import { WebSocketService } from "@/services/websocket/websocket-service.ts";
import { AuthService } from "@/services/auth-service/auth-service.ts";

export function registerServices(): void {
  const diContainer = DIContainer.getInstance();
  diContainer.register(ServiceName.ROUTER, Router);
  diContainer.register(ServiceName.EVENT_EMITTER, EventEmitter);
  diContainer.register(ServiceName.STORAGE, SessionStorage);
  diContainer.register(ServiceName.VALIDATOR, Validator);
  diContainer.register(ServiceName.WEBSOCKET, WebSocketService);
  diContainer.register(ServiceName.USER_SERVICE, AuthService);
}
