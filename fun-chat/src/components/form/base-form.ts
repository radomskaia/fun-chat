import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
// import { INPUT_NAMES } from "@/constants/input-constants.ts";
import { MESSAGES } from "@/constants/constants.ts";
import { ServiceName } from "@/types/di-container-types.ts";
import { DIContainer } from "@/services/di-container.ts";
// import { StorageKeys } from "@/types/session-storage-types.ts";
import { TypeNames } from "@/types/validator-types.ts";
import { NameInput } from "@/components/input/name-input.ts";
import { PasswordInput } from "@/components/input/password-input.ts";
import { TYPES } from "@/constants/websocket-constants.ts";
import { TextButton } from "@/components/buttons/text-button.ts";

export class BaseForm extends BaseComponent<"form"> {
  protected readonly nameElement;
  protected passwordElement;
  protected validator = DIContainer.getInstance().getService(
    ServiceName.VALIDATOR,
  );
  protected websocketService = DIContainer.getInstance().getService(
    ServiceName.WEBSOCKET,
  );
  constructor() {
    super();
    // const storage = DIContainer.getInstance().getService(ServiceName.STORAGE);
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

  protected getFormData(): {
    user: {
      login: string;
      password: string;
    };
  } {
    const formData = new FormData(this.element);
    const login = formData.get("name");
    const password = formData.get("password");
    if (
      !this.validator.validate(TypeNames.string, login) ||
      !this.validator.validate(TypeNames.string, password)
    ) {
      throw new TypeError(MESSAGES.INVALID_DATA);
    }
    return {
      user: {
        login,
        password,
      },
    };
  }

  protected formHandler(event: SubmitEvent): void {
    event.preventDefault();
    const data = this.getFormData();
    this.websocketService.requestToServer(TYPES.LOGIN, data, {
      action: () => console.log("LOGIN"),
      error: (error: string) => console.log(error),
    });
  }
}
