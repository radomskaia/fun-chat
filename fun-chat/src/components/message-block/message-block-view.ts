import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/message-block/message-block.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Message } from "@/services/message-service/message-types.ts";
import { MessageForm } from "@/components/form/message-form.ts";
import { EMPTY_STRING } from "@/constants/constants.ts";

export class MessageBlockView extends BaseComponent<"div"> {
  private username: string | null = null;
  private messageList: HTMLUListElement | null = null;
  private messageForm: MessageForm | null = null;
  public constructor() {
    super();
  }

  public createBlock(
    login: string,
    formHandler: (event: SubmitEvent) => void,
  ): void {
    this.element.textContent = EMPTY_STRING;
    this.createNameRow(login);
    this.createMessageList();
    this.createMessageInput(formHandler);
  }

  public clearBlock(): void {
    this.clearElement();
    this.element.textContent = "Select a user to send a message to...";
  }

  public getFormData(): string {
    if (!this.messageForm) {
      throw new Error("Message form is not initialized");
    }
    return this.messageForm.getFormData();
  }

  public addMessages(messages: Message[]): void {
    if (!this.messageList) {
      return;
    }
    for (const message of messages) {
      const justifyClass =
        message.from === this.username
          ? utilitiesStyles.alignSelfStart
          : utilitiesStyles.alignSelfEnd;

      const messageItem = this.createDOMElement({
        tagName: "li",
        textContent: message.text,
        classList: [justifyClass],
      });
      this.messageList.append(messageItem);
    }
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        styles.messageBlock,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap10,
        utilitiesStyles.flex,
      ],
      textContent: "Select a user to send a message to...",
    });
  }

  private createNameRow(login: string): void {
    const nameRow = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
        utilitiesStyles.widthFull,
      ],
    });
    this.username = login;
    this.element.append(nameRow);
    const name = this.createDOMElement({
      tagName: "p",
      textContent: login,
    });
    const status = this.createDOMElement({
      tagName: "p",
      textContent: "online or offline",
    });
    nameRow.append(name, status);
  }

  private createMessageList(): void {
    this.messageList = this.createDOMElement({
      tagName: "ul",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.widthFull,
        utilitiesStyles.gap10,
        utilitiesStyles.flexGrow1,
      ],
    });

    this.element.append(this.messageList);
  }

  private createMessageInput(formHandler: (event: SubmitEvent) => void): void {
    this.messageForm = new MessageForm(formHandler);
    this.element.append(this.messageForm.getElement());
  }
}
