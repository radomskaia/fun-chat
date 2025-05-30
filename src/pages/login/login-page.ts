import { LoginPageView } from "@/pages/login/login-page-view.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import type { Component } from "@/services/router/router-type.ts";
import { ValidatorTypes } from "@/services/validator/validator-types.ts";

export class LoginPage implements Component {
  private view: LoginPageView;
  private userService = DIContainer.getInstance().getService(
    ServiceName.USER_SERVICE,
  );
  constructor() {
    this.view = new LoginPageView((event: SubmitEvent) =>
      this.formHandler(event),
    );
  }

  public getElement(): HTMLDivElement {
    return this.view.getElement();
  }

  protected formHandler(event: SubmitEvent): void {
    event.preventDefault();
    const data = this.view.getFormData();
    const isValid = DIContainer.getInstance()
      .getService(ServiceName.VALIDATOR)
      .validate(ValidatorTypes.authData, data);
    if (isValid) {
      this.userService.login(data);
    }
  }
}
