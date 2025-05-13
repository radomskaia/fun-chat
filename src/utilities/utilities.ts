import { DELAY_TIME } from "@/constants/constants.ts";

export function errorHandler(error: unknown): void {
  if (error instanceof Error) {
    console.warn(error.message);
    return;
  }
  if (error instanceof Response) {
    console.warn(error.statusText);
    return;
  }
  if (error instanceof DOMException) {
    console.info(error.message);
    return;
  }
  console.warn(error);
}

export function debounce<F extends (...arguments_: Parameters<F>) => void>(
  callback: F,
  delay = DELAY_TIME,
) {
  let timeoutID: ReturnType<typeof setTimeout>;
  return function (...arguments_: Parameters<F>): void {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(...arguments_), delay);
  };
}
