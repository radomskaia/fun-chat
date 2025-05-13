import { BaseInput } from "@/components/input/base-input.ts";
import utilitiesStyles from "@/styles/utilities.module.css";

export class MessageInput extends BaseInput {
  constructor() {
    super({
      placeholder: "Your message...",
    });
    this.element.required = true;
    this.element.type = "text";
    this.element.autofocus = true;
    this.element.classList.add(utilitiesStyles.widthFull);
  }
}
