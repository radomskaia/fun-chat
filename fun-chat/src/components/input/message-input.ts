import { BaseInput } from "@/components/input/base-input.ts";

export class MessageInput extends BaseInput {
  constructor() {
    super({
      placeholder: "Your message...",
    });
    this.element.required = true;
    this.element.type = "text";
    this.element.autofocus = true;
  }
}
