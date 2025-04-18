import { BaseComponent } from "@/components/base-component.js";
import type { User } from "@/types/user-list-types.ts";
import { GlobalStoreKeys } from "@/Store/global-store/global-store-types.ts";
import { GlobalStore } from "@/Store/global-store/global-store.ts";

export class UserListView extends BaseComponent<"ul"> {
  public constructor() {
    super();
  }

  public addUsers(userList: User[]): Map<string, HTMLLIElement> {
    const usersMap = new Map<string, HTMLLIElement>();
    const currentUser = GlobalStore.getInstance().getState(
      GlobalStoreKeys.USER,
    )?.login;
    for (const user of userList) {
      if (user.login === currentUser) {
        continue;
      }
      const [key, value] = this.addUser(user);
      usersMap.set(key, value);
    }
    return usersMap;
  }

  public addUser(user: User): [string, HTMLLIElement] {
    const li = this.createDOMElement({
      tagName: "li",
      textContent: user.login,
    });
    this.appendElement(li);
    return [user.login, li];
  }

  protected createElement(): HTMLUListElement {
    return this.createDOMElement({
      tagName: "ul",
    });
  }
}
