import { extensions } from "vscode";
import { has } from "./base.utils";

export function hasExtension(id: string): boolean {
  return has(extensions.getExtension(id));
}
