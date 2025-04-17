export type ComponentConstructor = new () => Component;
export type Route = Map<string, ComponentConstructor>;
export interface Component {
  getElement: () => HTMLElement;
}
