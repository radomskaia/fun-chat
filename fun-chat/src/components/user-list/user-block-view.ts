import { BaseComponent } from "@/components/base-component.ts";
import { SearchUserInput } from "@/components/input/search-user-input.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { UserList } from "@/components/user-list/user-list.ts";
import type { User } from "@/types/user-list-types.ts";

export class UserBlockView extends BaseComponent<"div"> {
  private input;
  private readonly lists: {
    online: UserList;
    offline: UserList;
  } = {
    online: new UserList(),
    offline: new UserList(),
  };
  public constructor(callback: (event: Event) => void) {
    super();
    this.input = new SearchUserInput();
    this.input.getElement().addEventListener("input", callback);
    this.element.append(this.input.getElement());
    this.addDetails("online");
    this.addDetails("offline");
  }

  public addUsers(
    users: User[],
    status: "online" | "offline",
  ): Map<string, HTMLLIElement> {
    return this.lists[status].addUsers(users);
  }

  public appendUserToList(
    status: "online" | "offline",
    element: HTMLLIElement,
  ): void {
    this.lists[status].getElement().append(element);
  }

  public addUser(
    user: User,
    status: "online" | "offline",
  ): [string, HTMLLIElement] {
    return this.lists[status].addUser(user);
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
    });
  }

  private addDetails(status: "online" | "offline"): void {
    const element = this.createDOMElement({
      tagName: "details",
    });
    const summary = this.createDOMElement({
      tagName: "summary",
      textContent: status,
      classList: [utilitiesStyles.capitalize],
    });

    element.append(summary, this.lists[status].getElement());
    element.open = true;
    this.appendElement(element);
  }
}
