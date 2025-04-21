import type { Component } from "@/services/router/router-type.js";
import { UserItemView } from "@/components/user-item/user-item-view.ts";
import { MessageCountStore } from "@/services/message-service/message-store/message-count-store.ts";
import { ZERO } from "@/constants/constants.ts";
import { MessageHistoryStore } from "@/services/message-service/message-store/message-history-store.ts";
import { MessagesStateActions } from "@/services/message-service/message-types.ts";
import type { User } from "@/types/user-list-types.ts";

export class UserItem implements Component {
  private view;

  constructor(user: User) {
    this.view = new UserItemView(user.login);

    MessageCountStore.getInstance().subscribe((state) => {
      const count = state[user.login];
      if (!count) {
        return;
      }
      if (count === ZERO) {
        this.view.removeCounter();
      } else {
        this.view.addCounter(count);
      }
    }, user.login);

    this.view.getElement().addEventListener("click", () => {
      MessageHistoryStore.getInstance().dispatch({
        type: MessagesStateActions.SET_DIALOG_ID,
        payload: user,
      });
    });
  }

  public getElement(): HTMLLIElement {
    return this.view.getElement();
  }
}
