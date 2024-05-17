import { extensions } from "vscode";

export function hasExtension(id: string): boolean {
  return extensions.getExtension(id) !== undefined;
}
