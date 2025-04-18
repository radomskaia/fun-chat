import type { Injectable } from "@/services/di-container/di-container-types.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type { AuthData } from "@/services/auth-service/auth-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { RESPONSE_TYPES } from "@/services/websocket/websocket-types.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { GlobalStoreTypes } from "@/Store/global-store/global-store-types.ts";
import type { Observer } from "@/services/event-emitter/event-emitter-types.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";
import { GlobalStore } from "@/Store/global-store/global-store.ts";

export class AuthService implements Injectable, Observer {
  public name = ServiceName.USER_SERVICE;
  private websocketService = DIContainer.getInstance().getService(
    ServiceName.WEBSOCKET,
  );
  private storeController = GlobalStore.getInstance();
  private router = DIContainer.getInstance().getService(ServiceName.ROUTER);

  constructor() {
    DIContainer.getInstance()
      .getService(ServiceName.EVENT_EMITTER)
      .subscribe(ActionType.openSocket, this);
  }

  public login(authData?: AuthData | null): void {
    authData = authData || this.storeController.getState(GlobalStoreTypes.USER);
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
          this.storeController.dispatch(GlobalStoreTypes.USER, authData);
        }
        this.router.navigateTo(PAGE_PATH.MAIN);
      },
      error: (error: string) => console.log(error),
    });
  }

  public logout(): void {
    const authData = this.storeController.getState(GlobalStoreTypes.USER);
    const data = {
      user: authData,
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.LOGOUT, data);
    this.storeController.dispatch(GlobalStoreTypes.USER, null);
    this.router.navigateTo(PAGE_PATH.LOGIN);
  }

  public update(): void {
    this.login();
  }
}
