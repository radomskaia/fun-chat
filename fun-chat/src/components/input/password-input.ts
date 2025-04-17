import { BaseInput } from "@/components/input/base-input.ts";

export class PasswordInput extends BaseInput {
  constructor() {
    super({
      label: "password",
      placeholder: "Enter your password",
    });
    this.element.required = true;
    this.element.type = "password";
    // this.element.pattern = String.raw`(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}`;
    this.element.title =
      "Use at least 8 characters with no spaces and include at least one uppercase letter, one lowercase letter and one number";
    this.element.autocomplete = "current-password";
  }
}
