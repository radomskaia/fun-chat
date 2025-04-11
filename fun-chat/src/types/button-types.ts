export type Callback = (data?: unknown) => void | Promise<void>;

export interface ButtonOptions {
  title: string;
  path?: string;
  classList?: string[];
}
