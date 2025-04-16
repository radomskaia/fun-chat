import { BaseComponent } from "@/components/base-component.ts";
import { BaseForm } from "@/components/form/base-form.ts";

export class LoginPageView extends BaseComponent<"div"> {
  private form: BaseForm;
  constructor(formHandler: (event: SubmitEvent) => void) {
    super();
    this.form = new BaseForm(formHandler);
    this.appendElement(this.form.getElement());
  }

  public getFormData(): unknown {
    return this.form.getFormData();
  }

  protected createElement(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
    });
  }
}
