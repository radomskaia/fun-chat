import { BaseInput } from "@/components/input/base-input.ts";

export class NameInput extends BaseInput {
  constructor() {
    super({
      label: "name",
      placeholder: "Enter your name",
    });
    this.element.required = true;
    this.element.type = "text";
    this.element.minLength = 4;
    this.element.maxLength = 10;
    this.element.autocomplete = "username";
  }
}
