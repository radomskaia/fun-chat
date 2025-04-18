import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { MessageInput } from "@/components/input/message-input.ts";

export class MessageForm extends BaseComponent<
  "form",
  (event: SubmitEvent) => void
> {
  private input;
  constructor(formHandler: (event: SubmitEvent) => void) {
    super(formHandler);
    const button = new TextButton("Send Message");
    button.getElement().type = "submit";
    this.input = new MessageInput();
    this.appendElement(this.input.getElement(), button.getElement());
  }

  public getFormData(): string {
    const formData = this.input.value;
    this.input.resetValue();
    return formData;
  }

  protected createElement(
    formHandler: (event: SubmitEvent) => void,
  ): HTMLFormElement {
    const form = this.createDOMElement({
      tagName: "form",
    });
    this.addClassList(
      [
        utilitiesStyles.flex,
        utilitiesStyles.flexColumn,
        utilitiesStyles.gap10,
        utilitiesStyles.alignCenter,
      ],
      form,
    );
    form.addEventListener("submit", (event) => formHandler(event));
    return form;
  }
}
