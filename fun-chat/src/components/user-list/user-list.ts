import type { Component } from "@/types/router-type.ts";
import { UserListView } from "@/components/user-list/user-list-view.ts";
import type { User } from "@/types/user-list-types.ts";

export class UserList implements Component {
  private view: UserListView;

  constructor() {
    this.view = new UserListView();
  }

  public getElement(): HTMLUListElement {
    return this.view.getElement();
  }

  public addUsers(userList: User[]): Map<string, HTMLLIElement> {
    return this.view.addUsers(userList);
  }

  public addUser(user: User): [string, HTMLLIElement] {
    return this.view.addUser(user);
  }
}
