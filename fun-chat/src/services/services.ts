import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { Router } from "@/services/router.ts";
import { EventEmitter } from "@/services/event-emitter.ts";
import { SessionStorage } from "@/services/session-storage.ts";
import { Validator } from "@/services/validator.ts";
import { WebSocketService } from "@/services/websocket-service.ts";

export function registerServices(): void {
  const diContainer = DIContainer.getInstance();
  diContainer.register(ServiceName.ROUTER, Router);
  diContainer.register(ServiceName.EVENT_EMITTER, EventEmitter);
  diContainer.register(ServiceName.STORAGE, SessionStorage);
  diContainer.register(ServiceName.VALIDATOR, Validator);
  diContainer.register(ServiceName.WEBSOCKET, WebSocketService);
}
