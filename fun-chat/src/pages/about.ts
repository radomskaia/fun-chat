import { BaseComponent } from "@/components/base-component.ts";
import utilitiesStyles from "@/styles/utilities.module.css";
import { TextButton } from "@/components/buttons/text-button.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";

export class About extends BaseComponent<"div"> {
  private homeButton: TextButton;
  constructor() {
    super();
    this.homeButton = new TextButton(BUTTON_TEXT.BACK, () =>
      DIContainer.getInstance()
        .getService<ServiceName.ROUTER>(ServiceName.ROUTER)
        .navigateTo(PAGE_PATH.LOGIN),
    );
    this.appendElement(this.homeButton.getElement());
  }

  protected createElement(): HTMLDivElement {
    const main = this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.container,
        utilitiesStyles.flexColumn,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
      ],
    });

    const text = this.createDOMElement({
      tagName: "p",
      textContent:
        "App development is part of the JavaScript/Front-end 2024Q4 course at Rolling Scopes School by Alena Radomskaia",
    });

    main.append(text);
    return main;
  }
}
