import type { Injectable } from "@/types/di-container-types.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import type { LoginData } from "@/types/login-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { RESPONSE_TYPES } from "@/types/websocket-types.ts";
import { ValidatorTypes } from "@/types/validator-types.ts";
import { PAGE_PATH } from "@/constants/constants.ts";

export class LoginService implements Injectable {
  public name = ServiceName.LOGIN_SERVICE;
  private websocketService = DIContainer.getInstance().getService(
    ServiceName.WEBSOCKET,
  );
  private storageService = DIContainer.getInstance().getService(
    ServiceName.STORAGE,
  );
  private isLogin = false;
  private loginData: LoginData | null = null;
  private router = DIContainer.getInstance().getService(ServiceName.ROUTER);

  constructor() {
    const loginData = this.storageService.load(
      "loginData",
      ValidatorTypes.loginData,
    );
    if (loginData) {
      this.setLoginData(loginData);
    }
    window.addEventListener("beforeunload", () => {
      this.saveLoginData();
    });
  }

  public isLoggedIn(): boolean {
    return this.isLogin;
  }

  public login(loginData: LoginData): void {
    const data = {
      user: loginData,
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.LOGIN, data, {
      action: () => {
        this.setLoginData(loginData);
        this.router.navigateTo(PAGE_PATH.MAIN);
        console.log("LOGIN");
      },
      error: (error: string) => console.log(error),
    });
  }

  public logout(): void {
    const data = {
      user: this.loginData,
    };
    this.websocketService.requestToServer(RESPONSE_TYPES.LOGOUT, data, {
      action: () => {
        this.clearLoginData();
        this.router.navigateTo(PAGE_PATH.LOGIN);
        console.log("LOGOUT");
      },
      error: (error: string) => console.log(error),
    });
  }

  public saveLoginData(): void {
    if (this.isLogin) {
      this.storageService.save("loginData", {
        ...this.loginData,
        isLogin: this.isLogin,
      });
    }
  }

  private setLoginData(data: LoginData): void {
    this.loginData = data;
    this.isLogin = true;
  }

  private clearLoginData(): void {
    this.loginData = null;
    this.isLogin = false;
  }
}
