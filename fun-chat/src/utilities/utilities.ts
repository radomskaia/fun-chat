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
