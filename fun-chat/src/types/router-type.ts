export type ComponentConstructor = new () => Page;
export type Route = Map<string, ComponentConstructor>;
export interface Page {
  getElement: () => HTMLElement;
}
