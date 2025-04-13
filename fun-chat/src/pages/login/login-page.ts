import { BaseComponent } from "@/components/base-component.ts";
import { BaseForm } from "@/components/form/base-form.ts";

export class LoginPage extends BaseComponent<"div"> {
  constructor() {
    super();
    this.appendElement(new BaseForm().getElement());
  }
  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
    });
  }
}
