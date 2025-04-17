import type { User } from "@/types/user-list-types.ts";

export enum RESPONSE_TYPES {
  LOGIN = "USER_LOGIN",
  LOGOUT = "USER_LOGOUT",
  ACTIVE = "USER_ACTIVE",
  INACTIVE = "USER_INACTIVE",
  MESSAGE = "MSG_SEND",
  HISTORY = "MSG_FROM_USER",
  READ = "MSG_READ",
  DELETE = "MSG_DELETE",
  EDIT = "MSG_EDIT",
  ERROR = "ERROR",
  EXTERNAL_LOGIN = "USER_EXTERNAL_LOGIN",
  EXTERNAL_LOGOUT = "USER_EXTERNAL_LOGOUT",
  MESSAGE_DELIVER = "MSG_DELIVER",
}

export interface UsersPayload {
  users: User[];
}

export interface UserPayload {
  user: User;
}
