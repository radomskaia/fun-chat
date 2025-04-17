import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import type { AuthData } from "@/types/login-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { RESPONSE_TYPES } from "@/types/websocket-types.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { StoreController } from "@/Store/store-controller.ts";
import { StoreTypes } from "@/Store/store-types.ts";
import type { Observer } from "@/types/event-emitter-types.ts";
import { ActionType } from "@/types/event-emitter-types.ts";

export class UserService implements Injectable, Observer {
  public name = ServiceName.USER_SERVICE;
  private websocketService = DIContainer.getInstance().getService(
    ServiceName.WEBSOCKET,
  );
  private storeController = StoreController.getInstance();
  private router = DIContainer.getInstance().getService(ServiceName.ROUTER);

  constructor() {
    DIContainer.getInstance()
      .getService(ServiceName.EVENT_EMITTER)
      .subscribe(ActionType.openSocket, this);
  }

  public login(authData?: AuthData | null): void {
    authData = authData || this.storeController.getState(StoreTypes.USER);
    if (!authData) {
      this.router.navigateTo(PAGE_PATH.LOGIN);
      return;
    }
    const data = {
      user: authData,
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.LOGIN, data, {
      action: () => {
        if (authData) {
          this.storeController.dispatch(StoreTypes.USER, authData);
        }
        this.router.navigateTo(PAGE_PATH.MAIN);
      },
      error: (error: string) => console.log(error),
    });
  }

  public logout(): void {
    const authData = this.storeController.getState(StoreTypes.USER);
    const data = {
      user: authData,
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.LOGOUT, data);
    this.storeController.dispatch(StoreTypes.USER, null);
    this.router.navigateTo(PAGE_PATH.LOGIN);
  }

  public update(): void {
    this.login();
  }
}
