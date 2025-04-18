export enum ActionType {
  changeRoute = "changeRoute",
  openSocket = "openSocket",
  updateMessageStatus = "updateMessageStatus",
  editMessage = "editMessage",
  openChat = "openChat",
}

export interface Action {
  type: ActionType;
  data?: unknown;
}

export interface Observer {
  update(event: Action): void;
}
