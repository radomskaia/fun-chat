import utilitiesStyles from "@/styles/utilities.module.css";
import styles from "@/components/footer/footer.module.css";
import { BaseComponent } from "@/components/base-component.ts";

export class Footer extends BaseComponent<"footer"> {
  public constructor() {
    super();
  }

  protected createElement(): HTMLElement {
    const footer = this.createDOMElement({
      tagName: "footer",
      classList: [
        styles.footer,
        utilitiesStyles.container,
        utilitiesStyles.flex,
        utilitiesStyles.alignCenter,
        utilitiesStyles.justifyBetween,
        utilitiesStyles.widthFull,
      ],
    });

    const logo = this.createDOMElement({
      tagName: "img",
      classList: [styles.schoolLogo],
    });
    logo.src = "./logo-rsschool.png";

    const gitHubLink = this.createDOMElement({
      tagName: "a",
      textContent: "radomskaia",
      attributes: {
        href: "https://github.com/radomskaia",
        target: "_blank",
      },
    });

    const year = this.createDOMElement({
      tagName: "p",
      textContent: "2025",
    });

    footer.append(logo, gitHubLink, year);
    return footer;
  }
}
