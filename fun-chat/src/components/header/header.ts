import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/header/header.module.css";
import { BaseComponent } from "@/components/base-component.ts";
import { ThemeButton } from "@/components/buttons/settings/theme-button.ts";
import { ThemeService } from "@/services/settings/theme-service.ts";
import { APP_NAME, PAGE_PATH } from "@/constants/constants.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";
import { TextButton } from "@/components/buttons/text-button.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";

export class Header extends BaseComponent<"header"> {
  private readonly settingsButton = {
    theme: {
      button: ThemeButton,
      action: ThemeService,
    },
  };
  private readonly settingsWrapper: HTMLDivElement;
  constructor() {
    super();
    this.settingsWrapper = this.createSettingsWrapper();
    this.appendElement(this.settingsWrapper);
  }

  public addSettingsButton(buttonName: keyof typeof this.settingsButton): this {
    const button = new this.settingsButton[buttonName].button();
    const action = this.settingsButton[buttonName].action.getInstance(button);
    button.addToggleListener(action);
    this.settingsWrapper.append(button.getElement());
    return this;
  }

  protected createElement(): HTMLElement {
    const header = this.createDOMElement({
      tagName: "header",
      classList: [
        styles.header,
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.widthFull,
      ],
    });

    const headerPrimary = this.createDOMElement({
      tagName: "h1",
      textContent: APP_NAME,
      classList: [styles.headerPrimary],
    });

    const aboutButton = new TextButton("About", () => {
      DIContainer.getInstance()
        .getService(ServiceName.ROUTER)
        .navigateTo(PAGE_PATH.ABOUT);
    }).getElement();
    header.append(headerPrimary, aboutButton);
    return header;
  }

  private createSettingsWrapper(): HTMLDivElement {
    return this.createDOMElement({
      tagName: "div",
      classList: [
        utilitiesStyles.flex,
        utilitiesStyles.center,
        utilitiesStyles.gap30,
        utilitiesStyles.marginInline10,
      ],
    });
  }
}
