import type { ButtonOptions } from "@/types/button-types.ts";

interface Options {
  classList?: string[];
  attributes?: Record<string, string>;
}

export interface ElementOptions<T> extends Options {
  tagName: T;
  textContent?: string;
}

export interface CreateSVGIconOptions
  extends Required<Omit<ButtonOptions, "title">> {
  attributes?: Record<string, string>;
}

export type Callback = (data?: unknown) => void | Promise<void>;
