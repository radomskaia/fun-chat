import { BaseModal } from "@/components/modal/base/base-modal.ts";
import styles from "@/components/modal/base/modal.module.css";

export class ReconnectModal extends BaseModal {
  private isLoading = false;
  public constructor() {
    super();
    this.addContent();

    this.element.addEventListener("cancel", (event) => {
      event.preventDefault();
      console.log("cancel");
    });

    document.addEventListener("keydown", (event) => {
      this.blockEscap(event);
    });
  }

  public addContent(): void {
    const reconnectMessage = this.createDOMElement({
      tagName: "p",
      textContent: "Connecting to the server",
    });
    const loader = this.createDOMElement({
      tagName: "div",
      classList: [styles.spinner],
    });
    this.modalWrapper.append(reconnectMessage, loader);
  }

  public showModal(): void {
    if (this.isLoading) {
      return;
    }
    super.showModal();

    this.isLoading = true;
  }

  public close(): void {
    this.element.close();
    this.element.remove();
    this.isLoading = false;
  }

  protected createElement(): HTMLDialogElement {
    return this.createDOMElement({
      tagName: "dialog",
      classList: [styles.modal],
    });
  }

  private blockEscap(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.isLoading) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
