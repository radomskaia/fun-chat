import {
  EMPTY_STRING,
  ERROR_MESSAGES,
  MESSAGES,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import type { Injectable } from "@/types/di-container-types";
import { ServiceName } from "@/types/di-container-types";
import { DIContainer } from "@/services/di-container.ts";
import { ActionType } from "@/types/event-emitter-types.ts";
import type { Route } from "@/types/router-type.ts";
import type { LoginService } from "@/services/login-service.ts";
import type { EventEmitter } from "@/services/event-emitter.ts";

export class Router implements Injectable {
  public name: ServiceName = ServiceName.ROUTER;
  private routes: Route = new Map();
  private container: HTMLElement | null = null;
  private currentPath = EMPTY_STRING;
  private loginService: LoginService | null = null;
  private eventEmitter: EventEmitter | null = null;

  constructor() {
    globalThis.addEventListener("hashchange", () => {
      this.routerChange();
    });
  }

  public init(): void {
    this.loginService = DIContainer.getInstance().getService(
      ServiceName.LOGIN_SERVICE,
    );
    this.eventEmitter = DIContainer.getInstance().getService(
      ServiceName.EVENT_EMITTER,
    );
  }

  public setContainer(container: HTMLElement): this {
    this.container = container;
    return this;
  }

  public addRoutes(routes: Route): void {
    this.init();
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    this.clearPage();
    const isLogin = this.loginService?.isLoggedIn();

    if (path === PAGE_PATH.LOGIN && isLogin) {
      path = PAGE_PATH.MAIN;
    } else if (path === PAGE_PATH.MAIN && !isLogin) {
      path = PAGE_PATH.LOGIN;
    }

    this.currentPath = path;

    let route = this.routes.get(path) ?? this.routes.get(PAGE_PATH.NOT_FOUND);
    if (!route) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    globalThis.location.hash = path;
    if (!this.container) {
      throw new Error(ERROR_MESSAGES.CONTAINER_NOT_FOUND);
    }
    this.eventEmitter?.notify({ type: ActionType.changeRoute, data: path });
    this.container.append(new route().getElement());
  }

  private clearPage(): void {
    if (!this.container) {
      throw new Error(MESSAGES.ROUTE_NOT_FOUND);
    }
    this.container.replaceChildren();
  }

  private routerChange(): void {
    const hash: string =
      globalThis.location.hash.slice(SYMBOLS.HASH.length) || PAGE_PATH.LOGIN;
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
