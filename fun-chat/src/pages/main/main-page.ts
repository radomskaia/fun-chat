import { MainPageView } from "@/pages/main/main-page-view.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type { Component } from "@/services/router/router-type.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { GlobalStoreKeys } from "@/Store/global-store/global-store-types.ts";
import type { Observer } from "@/services/event-emitter/event-emitter-types.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import { GlobalStore } from "@/Store/global-store/global-store.ts";

export class MainPage implements Component, Observer {
  private readonly view;
  private userService = DIContainer.getInstance().getService(
    ServiceName.USER_SERVICE,
  );
  private store = GlobalStore.getInstance();

  constructor() {
    const user = this.store.getState(GlobalStoreKeys.USER);
    if (!user) {
      this.userService.logout();
      throw new Error("User is not logged in");
    }
    this.view = new MainPageView(user.login, () => this.userService.logout());
    DIContainer.getInstance()
      .getService(ServiceName.EVENT_EMITTER)
      .subscribe(ActionType.openSocket, this);
  }

  public update(): void {
    const login = this.store.getState(GlobalStoreKeys.USER)?.login;
    if (!login) {
      return;
    }
    this.view.refreshUserBlock();
  }

  public getElement(): HTMLDivElement {
    if (!this.view) {
      throw new Error("View is not initialized");
    }
    return this.view.getElement();
  }
}
