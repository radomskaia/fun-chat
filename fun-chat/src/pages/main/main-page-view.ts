import { BaseComponent } from "@/components/base-component.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import type { Callback } from "@/types";
import utilitiesStyles from "@/styles/utilities.module.css";
import { UserBlock } from "@/components/user-block/user-block.ts";
import { MessageBlock } from "@/components/message-block/message-block.ts";
import { Footer } from "@/components/footer/footer.ts";

export class MainPageView extends BaseComponent<"div"> {
  private mainWrapper: HTMLDivElement | null = null;
  constructor(username: string, callback: Callback) {
    super();
    this.addHeader(username, callback);
    this.createMainBlock();
    const footer = new Footer().getElement();
    this.element.append(footer);
  }

  public createMainBlock(): void {
    this.mainWrapper?.remove();
    this.mainWrapper = this.createDOMElement({
      tagName: "div",
      classList: [utilitiesStyles.flex, utilitiesStyles.gap20],
    });
    const userBlock = new UserBlock();
    const messageBlock = new MessageBlock().getElement();
    this.mainWrapper.append(userBlock.getElement(), messageBlock);
    this.element.append(this.mainWrapper);
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.container,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap30,
      ],
    });
  }

  private addHeader(username: string, callback: Callback): void {
    const header = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
      ],
    });
    const user = this.createDOMElement({
      tagName: "p",
      textContent: `User: ${username}`,
    });
    const button = new TextButton("LogOut", callback).getElement();
    header.append(user, button);
    this.element.append(header);
  }
}
