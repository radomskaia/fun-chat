import { BaseComponent } from "@/components/base-component.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { DIContainer } from "@/services/di-container.ts";
import { ServiceName } from "@/types/di-container-types.ts";

export class MainPage extends BaseComponent<"div"> {
  constructor() {
    super();
    this.appendElement(
      new TextButton("LogOut", () => {
        DIContainer.getInstance()
          .getService(ServiceName.LOGIN_SERVICE)
          .logout();
      }).getElement(),
    );
  }
  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
    });
  }
}
