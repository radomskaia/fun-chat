import { NotFound } from "@/pages/not-found.ts";
import { PAGE_PATH } from "@/constants/constants.ts";
import { LoginPage } from "@/pages/login/login-page.ts";
import type { ComponentConstructor } from "@/types/router-type.ts";

export const appRoutes = new Map<string, ComponentConstructor>([
  [PAGE_PATH.LOGIN, LoginPage],
  [PAGE_PATH.NOT_FOUND, NotFound],
]);
