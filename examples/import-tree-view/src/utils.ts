import pino, { Logger } from "pino";
export function has<T>(foo: T | undefined): foo is T {
  return foo !== undefined;
}
export function getLogger(name: string): Logger {
  return pino({
    name: name,
    level: "info"
  });
}
