import type { AuthData } from "@/types/login-types.ts";

export enum ValidatorTypes {
  object = "object",
  string = "string",
  number = "number",
  positiveNumber = "positiveNumber",
  boolean = "boolean",
  authData = "authData",
}

export interface TypesForValidator {
  [ValidatorTypes.object]: object;
  [ValidatorTypes.string]: string;
  [ValidatorTypes.number]: number;
  [ValidatorTypes.positiveNumber]: number;
  [ValidatorTypes.boolean]: boolean;
  [ValidatorTypes.authData]: AuthData;
}
