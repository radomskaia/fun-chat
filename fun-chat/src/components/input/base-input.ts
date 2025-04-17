import { BaseComponent } from "@/components/base-component.ts";
import { EMPTY_STRING } from "@/constants/constants.ts";
import styles from "@/components/input/input.module.css";

export abstract class BaseInput extends BaseComponent<
  "input",
  {
    label?: string;
    placeholder: string;
  }
> {
  private defaultValue = EMPTY_STRING;

  public get value(): string {
    return this.element.value;
  }

  public set value(value: string) {
    this.element.value = value;
  }

  public setDefaultValue(): void {
    this.defaultValue = this.element.value;
  }

  public resetValue(): void {
    this.element.value = this.defaultValue;
  }

  public toggleDisabled(): void {
    this.element.disabled = !this.element.disabled;
  }

  protected createElement(options: {
    label?: string;
    placeholder: string;
  }): HTMLInputElement {
    const input = this.createDOMElement({
      tagName: "input",
      classList: [styles.input],
    });
    if (options.label) {
      input.name = options.label;
    }
    input.placeholder = options.placeholder;
    return input;
  }
}
