import { BaseModal } from "@/components/modal/base/base-modal.ts";

export class LoginErrorModal extends BaseModal {
  public constructor() {
    super();
  }
  public addContent(error: string): void {
    this.modalWrapper.replaceChildren();
    const errorElement = this.createDOMElement({
      tagName: "p",
      textContent: error,
    });

    this.modalWrapper.append(errorElement);
  }
}
