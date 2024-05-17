
export const LIB_ID = "my-little-extension";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function has<T>(foo: T | undefined): foo is T {
  return foo !== undefined;
}

export function tryParseInt(entry: string): number | undefined {
  try {
    return parseInt(entry);
  } catch (error) {
    return undefined;
  }
}
