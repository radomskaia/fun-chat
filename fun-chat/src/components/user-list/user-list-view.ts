import { BaseComponent } from "@/components/base-component.js";
import type { User } from "@/types/user-list-types.ts";
import { GlobalStoreKeys } from "@/Store/global-store/global-store-types.ts";
import { GlobalStore } from "@/Store/global-store/global-store.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { UserItem } from "@/components/user-item/user-item.ts";

export class UserListView extends BaseComponent<"ul"> {
  private messageService = DIContainer.getInstance().getService(
    ServiceName.MESSAGE_SERVICE,
  );
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
      const [id, value] = this.addUser(user);
      this.messageService.setNewMessagesCount(id);
      usersMap.set(id, value);
    }
    return usersMap;
  }

  public addUser(user: User): [string, HTMLLIElement] {
    const li = new UserItem(user).getElement();
    this.appendElement(li);
    return [user.login, li];
  }

  protected createElement(): HTMLUListElement {
    return this.createDOMElement({
      tagName: "ul",
    });
  }
}
