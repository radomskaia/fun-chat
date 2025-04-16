import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { NameInput } from "@/components/input/name-input.ts";
import { PasswordInput } from "@/components/input/password-input.ts";
import { TextButton } from "@/components/buttons/text-button.ts";

export class BaseForm extends BaseComponent<
  "form",
  (event: SubmitEvent) => void
> {
  private inputConfig = {
    username: NameInput,
    password: PasswordInput,
  };

  constructor(formHandler: (event: SubmitEvent) => void) {
    super(formHandler);
    this.addInputs();
    const button = new TextButton("Submit");
    button.getElement().type = "submit";
    this.appendElement(button.getElement());
  }

  public getFormData(): unknown {
    const formData = new FormData(this.element);
    const login = formData.get("name");
    const password = formData.get("password");
    return {
      login,
      password,
    };
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

  private addInputs(): void {
    for (const [key, value] of Object.entries(this.inputConfig)) {
      const label = this.createDOMElement({
        tagName: "label",
        textContent: `${key}: `,
        classList: [
          utilitiesStyles.flex,
          utilitiesStyles.gap10,
          utilitiesStyles.alignCenter,
          utilitiesStyles.capitalize,
        ],
      });
      const input = new value();
      label.append(input.getElement());
      this.appendElement(label);
    }
  }
}
