import { BaseComponent } from "@/components/base-component.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import type { Callback } from "@/types";
import utilitiesStyles from "@/styles/utilities.module.css";
import { UserBlock } from "@/components/user-block/user-block.ts";

export class MainPageView extends BaseComponent<"div"> {
  private userBlock;
  constructor(username: string, callback: Callback) {
    super();
    this.addHeader(username, callback);
    this.userBlock = new UserBlock();
    this.element.append(this.userBlock.getElement());
  }

  public refreshUserBlock(): void {
    this.userBlock.getElement().remove();
    this.userBlock = new UserBlock();
    this.element.append(this.userBlock.getElement());
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [utilitiesStyles.container],
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
