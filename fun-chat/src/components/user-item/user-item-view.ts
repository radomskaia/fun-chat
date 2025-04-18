import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";

export class UserItemView extends BaseComponent<"li", string> {
  private counter: HTMLElement | null = null;
  public constructor(login: string) {
    super(login);
  }
  public addCounter(count: number): void {
    if (this.counter) {
      this.counter.textContent = count.toString();
    } else {
      this.counter = this.createDOMElement({
        tagName: "p",
        textContent: count.toString(),
      });
      this.element.append(this.counter);
    }
  }

  public removeCounter(): void {
    if (this.counter) {
      this.counter.remove();
      this.counter = null;
    }
  }

  protected createElement(login: string): HTMLElementTagNameMap["li"] {
    return this.createDOMElement({
      tagName: "li",
      classList: [utilitiesStyles.flex, utilitiesStyles.gap10],
      textContent: login,
    });
  }
}
