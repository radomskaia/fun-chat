import { BaseComponent } from "@/components/base-component.ts";
import styles from "@/components/message-block/message-block.module.css";
import utilitiesStyles from "@/styles/utilities.module.css";
import type { Message } from "@/services/message-service/message-types.ts";
import { MessageForm } from "@/components/form/message-form.ts";
import { EMPTY_STRING, ZERO } from "@/constants/constants.ts";
import type { User } from "@/types/user-list-types.ts";
import { RESPONSE_TYPES } from "@/services/websocket/websocket-types.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";

export class MessageBlockView extends BaseComponent<"div"> {
  private user: User | null = null;
  private messageList: HTMLUListElement | null = null;
  private messageForm: MessageForm | null = null;
  private statusElement: HTMLParagraphElement | null = null;

  public constructor() {
    super();
    const websocketService = DIContainer.getInstance().getService(
      ServiceName.WEBSOCKET,
    );
    const validator = DIContainer.getInstance().getService(
      ServiceName.VALIDATOR,
    );
    websocketService.requestFromServer(RESPONSE_TYPES.EXTERNAL_LOGIN, {
      action: (data: unknown) => {
        if (
          validator.validate(ValidatorTypes.userPayload, data) &&
          data.user.login === this.user?.login
        ) {
          this.changeStatus(data.user);
        }
      },
    });
    websocketService.requestFromServer(RESPONSE_TYPES.EXTERNAL_LOGOUT, {
      action: (data: unknown) => {
        if (
          validator.validate(ValidatorTypes.userPayload, data) &&
          data.user.login === this.user?.login
        ) {
          this.changeStatus(data.user);
        }
      },
    });
  }

  public createBlock(
    user: User,
    formHandler: (event: SubmitEvent) => void,
  ): void {
    this.element.textContent = EMPTY_STRING;
    this.createNameRow(user);
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
    if (!this.messageList || messages.length === ZERO) {
      return;
    }
    this.messageList.textContent = EMPTY_STRING;
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  public addMessage(message: Message): void {
    if (!this.messageList) {
      return;
    }

    if (this.messageList.textContent === "Write your first message...") {
      this.messageList.textContent = EMPTY_STRING;
    }

    const justifyClass =
      message.from === this.user?.login
        ? utilitiesStyles.alignSelfStart
        : utilitiesStyles.alignSelfEnd;
    const messageItem = this.createDOMElement({
      tagName: "li",
      textContent: message.text,
      classList: [justifyClass, styles.message],
    });
    this.messageList.append(messageItem);
  }

  public scrollToBottom(): void {
    this.messageList?.scrollTo({
      top: this.messageList.scrollHeight,
      behavior: "smooth",
    });
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

  private createNameRow(user: User): void {
    const nameRow = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.alignCenter,
        utilitiesStyles.widthFull,
      ],
    });
    this.user = user;
    this.element.append(nameRow);
    const name = this.createDOMElement({
      tagName: "p",
      textContent: user.login,
    });
    const status = this.createDOMElement({
      tagName: "p",
    });
    this.statusElement = status;
    this.changeStatus(user);
    nameRow.append(name, status);
  }

  private changeStatus(user: User): void {
    if (this.statusElement) {
      this.statusElement.textContent = user.isLogined ? "online" : "offline";
    }
  }

  private createMessageList(): void {
    this.messageList = this.createDOMElement({
      tagName: "ul",
      textContent: "Write your first message...",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.widthFull,
        utilitiesStyles.gap10,
        utilitiesStyles.flexGrow1,
        styles.messagesField,
      ],
    });

    this.element.append(this.messageList);
  }

  private createMessageInput(formHandler: (event: SubmitEvent) => void): void {
    this.messageForm = new MessageForm(formHandler);
    this.element.append(this.messageForm.getElement());
  }
}
