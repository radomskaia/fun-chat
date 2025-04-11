export enum ActionType {
  changeRoute = "changeRoute",
}

export interface Action {
  type: ActionType;
  data?: unknown;
}

export interface Observer {
  update(event: Action): void;
}
