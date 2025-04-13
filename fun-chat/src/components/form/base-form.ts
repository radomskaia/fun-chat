import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { MESSAGES } from "@/constants/constants.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ValidatorTypes } from "@/types/validator-types.ts";
import { NameInput } from "@/components/input/name-input.ts";
import { PasswordInput } from "@/components/input/password-input.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import type { LoginData } from "@/types/login-types.ts";

export class BaseForm extends BaseComponent<"form"> {
  protected readonly nameElement;
  protected passwordElement;
  protected validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );
  protected loginService = DIContainer.getInstance().getService(
    ServiceName.LOGIN_SERVICE,
  );
  constructor() {
    super();
    const labelName = this.createDOMElement({
      tagName: "label",
      textContent: "Username:",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap10,
        utilitiesStyles.alignCenter,
      ],
    });
    this.nameElement = new NameInput();
    labelName.append(this.nameElement.getElement());
    const labelPassword = this.createDOMElement({
      tagName: "label",
      textContent: "Password:",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.gap10,
        utilitiesStyles.alignCenter,
      ],
    });
    this.passwordElement = new PasswordInput();
    labelPassword.append(this.passwordElement.getElement());
    const button = new TextButton("Submit");
    button.getElement().type = "submit";
    this.appendElement(labelName, labelPassword, button.getElement());
  }

  protected createElement(): HTMLFormElement {
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
    form.addEventListener("submit", (event) => this.formHandler(event));
    return form;
  }

  protected getFormData(): LoginData {
    const formData = new FormData(this.element);
    const login = formData.get("name");
    const password = formData.get("password");
    if (
      !this.validator.validate(ValidatorTypes.string, login) ||
      !this.validator.validate(ValidatorTypes.string, password)
    ) {
      throw new TypeError(MESSAGES.INVALID_DATA);
    }
    return {
      login,
      password,
    };
  }

  protected formHandler(event: SubmitEvent): void {
    event.preventDefault();
    const data = this.getFormData();
    this.loginService.login(data);
  }
}
