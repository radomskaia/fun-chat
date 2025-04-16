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
import { StoreController } from "@/Store/store-controller.ts";
import { StoreTypes } from "@/Store/store-types.ts";

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
    this.clearPage();
    const isLogin = StoreController.getInstance().getState(StoreTypes.USER);

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
    if (hash === this.currentPath) {
      return;
    }
    this.navigateTo(hash);
  }
}
