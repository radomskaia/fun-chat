import { NotFound } from "@/pages/not-found.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { LoginPage } from "@/pages/login/login-page.ts";
import type { ComponentConstructor } from "@/services/router/router-type.ts";
import { MainPage } from "@/pages/main/main-page.ts";
import { About } from "@/pages/about.ts";

export const appRoutes = new Map<string, ComponentConstructor>([
  [PAGE_PATH.LOGIN, LoginPage],
  [PAGE_PATH.NOT_FOUND, NotFound],
  [PAGE_PATH.MAIN, MainPage],
  [PAGE_PATH.ABOUT, About],
]);
