import { BaseInput } from "@/components/input/base-input.ts";

export class NameInput extends BaseInput {
  constructor() {
    super({
      label: "name",
      placeholder: "Enter your name",
    });
    this.element.required = true;
    this.element.type = "text";
    this.element.pattern = "[a-zA-Z0-9_]{4,10}";
    this.element.title =
      "Use 4–10 characters with no spaces. Only letters (a–z, A–Z), numbers (0–9), and underscores (_) are allowed";
    this.element.autocomplete = "username";
    this.element.autofocus = true;
  }
}
