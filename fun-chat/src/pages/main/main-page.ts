import { MainPageView } from "@/pages/main/main-page-view.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type { Component } from "@/services/router/router-type.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { StoreTypes } from "@/Store/store-types.ts";
import type { Observer } from "@/services/event-emitter/event-emitter-types.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";

export class MainPage implements Component, Observer {
  private readonly view;
  private userService = DIContainer.getInstance().getService(
    ServiceName.USER_SERVICE,
  );
  private store = StoreController.getInstance();

  constructor() {
    const user = this.store.getState(StoreTypes.USER);
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
    const login = this.store.getState(StoreTypes.USER)?.login;
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
