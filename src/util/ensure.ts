/**
 * Checks if `test` is truthy. If it is not, then throw with the given message
 * @param test The object to check for truthiness
 * @param msg The message to throw if `test` is falsy
 */
export function ensure(test: any, msg: string): void {
  if (!test) {
    throw new Error(msg);
  }
}

export function ensureExist<T>(element: T | undefined, msg: string): T {
  if (!element) {
    throw new Error(msg);
  }
  return element;
}
