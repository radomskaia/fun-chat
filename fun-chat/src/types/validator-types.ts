import type { AuthData } from "@/types/login-types.ts";
import type { User } from "@/types/user-list-types.ts";
import type { UserPayload, UsersPayload } from "@/types/websocket-types.ts";

export enum ValidatorTypes {
  object = "object",
  string = "string",
  number = "number",
  positiveNumber = "positiveNumber",
  boolean = "boolean",
  authData = "authData",
  user = "user",
  // userArray = "userArray",
  usersPayload = "usersPayload",
  userPayload = "userPayload",
}

export interface TypesForValidator {
  [ValidatorTypes.object]: object;
  [ValidatorTypes.string]: string;
  [ValidatorTypes.number]: number;
  [ValidatorTypes.positiveNumber]: number;
  [ValidatorTypes.boolean]: boolean;
  [ValidatorTypes.authData]: AuthData;
  [ValidatorTypes.user]: User;
  // [ValidatorTypes.userArray]: User[];
  [ValidatorTypes.usersPayload]: UsersPayload;
  [ValidatorTypes.userPayload]: UserPayload;
}
