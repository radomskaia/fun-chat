export enum ActionType {
  changeRoute = "changeRoute",
  openSocket = "openSocket",
}

export interface Action {
  type: ActionType;
  data?: unknown;
}

export interface Observer {
  update(event: Action): void;
}
