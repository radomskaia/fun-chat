import { Header } from "@/components/header/header.ts";
import { appRoutes } from "@/pages/routes.ts";
import { BUTTON_TEXT } from "@/constants/buttons-constants.ts";
import { ServiceName } from "@/services/di-container/di-container-types.ts";
import { registerServices } from "@/services/services.ts";
import { DIContainer } from "@/services/di-container/di-container.ts";

export function app(): void {
  registerServices();

  const body = document.body;
  const header = new Header().addSettingsButton(BUTTON_TEXT.THEME).getElement();

  const main = document.createElement("main");
  body.append(header, main);

  DIContainer.getInstance()
    .getService(ServiceName.ROUTER)
    .setContainer(main)
    .addRoutes(appRoutes);
}
