import type { Component } from "@/services/router/router-type.ts";
import { UserBlockView } from "@/components/user-block/user-block-view.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import type { User, UserState } from "@/types/user-list-types.ts";
import { RESPONSE_TYPES } from "@/services/websocket/websocket-types.ts";
import { debounce } from "@/utilities/utilities.ts";
import { DELAY_TIME } from "@/constants/constants.ts";

export class UserBlock implements Component {
  private view: UserBlockView;
  private users: Record<string, Map<string, HTMLLIElement>> = {};
  private websocketService = DIContainer.getInstance().getService(
    ServiceName.WEBSOCKET,
  );
  private validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );
  constructor() {
    const debouncedHandler = debounce(this.inputHandler.bind(this), DELAY_TIME);
    this.view = new UserBlockView((event: Event) => {
      debouncedHandler(event);
    });
    this.getUsers(RESPONSE_TYPES.ACTIVE);
    this.getUsers(RESPONSE_TYPES.INACTIVE);
    this.websocketService.requestFromServer(RESPONSE_TYPES.EXTERNAL_LOGIN, {
      action: (data: unknown) => {
        if (this.validator.validate(ValidatorTypes.userPayload, data)) {
          this.addUser(data.user, "online");
          DIContainer.getInstance()
            .getService(ServiceName.MESSAGE_SERVICE)
            .setNewMessagesCount(data.user.login);
        }
      },
    });
    this.websocketService.requestFromServer(RESPONSE_TYPES.EXTERNAL_LOGOUT, {
      action: (data: unknown) => {
        if (this.validator.validate(ValidatorTypes.userPayload, data)) {
          this.addUser(data.user, "offline");
          DIContainer.getInstance()
            .getService(ServiceName.MESSAGE_SERVICE)
            .setNewMessagesCount(data.user.login);
        }
      },
    });
  }

  public getElement(): HTMLDivElement {
    return this.view.getElement();
  }

  private inputHandler(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const value = event.target.value.toLowerCase();
    let filteredUsers = {
      online: [...this.users.online.keys()].filter((login) =>
        login.toLowerCase().includes(value),
      ),
      offline: [...this.users.offline.keys()].filter((login) =>
        login.includes(value),
      ),
    };
    for (const key of ["online", "offline"] as const) {
      const list = this.users[key];
      for (const [login, element] of list.entries()) {
        if (filteredUsers[key].includes(login)) {
          if (element.isConnected) {
            continue;
          }
          this.view.appendUserToList(key, element);
        } else {
          element.remove();
        }
      }
    }
  }

  private addUser(user: User, type: "online" | "offline"): void {
    for (const key of Object.keys(this.users)) {
      if (key !== type) {
        const element = this.users[key].get(user.login);
        if (element) {
          element.remove();
        }
        this.users[key].delete(user.login);
        continue;
      }
      const [userKey, value] = this.view.addUser(user, key);
      this.users[key].set(userKey, value);
    }
  }

  private getUsers(type: UserState): void {
    const key = type === RESPONSE_TYPES.ACTIVE ? "online" : "offline";
    this.websocketService.requestToServer(type, null, {
      error: (error: string) => {
        console.error(error);
      },
      action: (data: unknown) => {
        if (this.validator.validate(ValidatorTypes.usersPayload, data)) {
          this.users[key] = this.view.addUsers(data.users, key);
        }
      },
    });
  }
}
