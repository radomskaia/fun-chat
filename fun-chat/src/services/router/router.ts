import {
  EMPTY_STRING,
  ERROR_MESSAGES,
  MESSAGES,
  PAGE_PATH,
  SYMBOLS,
} from "@/constants/constants.ts";
import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import type { Route } from "@/services/router/router-type.ts";
import { GlobalStoreTypes } from "@/Store/global-store/global-store-types.ts";
import { GlobalStore } from "@/Store/global-store/global-store.ts";

export class Router implements Injectable {
  public name: ServiceName = ServiceName.ROUTER;
  private routes: Route = new Map();
  private container: HTMLElement | null = null;
  private currentPath = EMPTY_STRING;
  private eventEmitter;

  constructor() {
    globalThis.addEventListener("hashchange", () => {
      this.routerChange();
    });
    this.eventEmitter = DIContainer.getInstance().getService(
      ServiceName.EVENT_EMITTER,
    );
  }

  public setContainer(container: HTMLElement): this {
    this.container = container;
    return this;
  }

  public addRoutes(routes: Route): void {
    this.routes = routes;
    this.routerChange();
  }

  public navigateTo(path: string): void {
    if (path === this.currentPath) {
      return;
    }

    this.clearPage();
    const isLogin = GlobalStore.getInstance().getState(GlobalStoreTypes.USER);

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
    this.eventEmitter.notify({ type: ActionType.changeRoute, data: path });
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
    this.navigateTo(hash);
  }
}
