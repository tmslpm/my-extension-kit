import { BaseExtension } from "my-extension-kit/base.extension";

import { ImportExplorer } from "./explorers/import.explorer";

let id = "importtreeview";
export const [activate, deactivate] = new BaseExtension(id)
  .register(new ImportExplorer(id))
  .finalize();
