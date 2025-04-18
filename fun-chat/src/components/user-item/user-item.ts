import type { Component } from "@/services/router/router-type.js";
import { UserItemView } from "@/components/user-item/user-item-view.ts";
import { MessageCountStore } from "@/services/message-service/message-count-store.ts";
import { ZERO } from "@/constants/constants.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ActionType } from "@/services/event-emitter/event-emitter-types.ts";

export class UserItem implements Component {
  private view;
  private eventEmitter = DIContainer.getInstance().getService(
    ServiceName.EVENT_EMITTER,
  );

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
      this.eventEmitter.notify({ type: ActionType.openChat, data: login });
    });
  }

  public getElement(): HTMLLIElement {
    return this.view.getElement();
  }
}
