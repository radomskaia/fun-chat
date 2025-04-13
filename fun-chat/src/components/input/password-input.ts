import { BaseInput } from "@/components/input/base-input.ts";

export class PasswordInput extends BaseInput {
  constructor() {
    super({
      label: "password",
      placeholder: "Enter your password",
    });
    this.element.required = true;
    this.element.type = "password";
    this.element.minLength = 8;
    this.element.maxLength = 16;
    this.element.autocomplete = "current-password";
  }
}
