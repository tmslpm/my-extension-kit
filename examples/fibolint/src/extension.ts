import { BaseExtension } from "my-extension-kit/base.extension";
import { PingCmd } from "./commands/ping.command";
import { FiboNumberCompletion } from "./languages/completions/fibo-number.completion";
import { FiboNumberDecoration } from "./decorations/fibo-number.decoration";
import { TestNotebook } from "./notebooks/test.notebook";

let id = "fibolint";
export const [activate, deactivate] = new BaseExtension(id)
  .register(new PingCmd(id))
  .register(new FiboNumberCompletion(id))
  .register(new FiboNumberDecoration(id))
  .register(new TestNotebook(id))
  .finalize();
