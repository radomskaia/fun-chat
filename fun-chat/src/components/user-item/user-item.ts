import type { Component } from "@/services/router/router-type.js";
import { UserItemView } from "@/components/user-item/user-item-view.ts";
import { MessageCountStore } from "@/services/message-service/message-store/message-count-store.ts";
import { ZERO } from "@/constants/constants.ts";
import { MessageHistoryStore } from "@/services/message-service/message-store/message-history-store.ts";
import { MessagesStateActions } from "@/services/message-service/message-types.ts";

export class UserItem implements Component {
  private view;

  constructor(login: string) {
    this.view = new UserItemView(login);

    MessageCountStore.getInstance().subscribe((state) => {
      const count = state[login];
      if (!count) {
        return;
      }
      if (count === ZERO) {
        this.view.removeCounter();
      } else {
        this.view.addCounter(count);
      }
    }, login);

    this.view.getElement().addEventListener("click", () => {
      MessageHistoryStore.getInstance().dispatch({
        type: MessagesStateActions.SET_DIALOG_ID,
        payload: login,
      });
    });
  }

  public getElement(): HTMLLIElement {
    return this.view.getElement();
  }
}
