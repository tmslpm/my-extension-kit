"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const base_extension_1 = require("my-extension-kit/src/base.extension");
const ping_command_1 = require("./commands/ping.command");
const fibo_number_completion_1 = require("./languages/completions/fibo-number.completion");
const fibo_number_decoration_1 = require("./decorations/fibo-number.decoration");
const test_notebook_1 = require("./notebooks/test.notebook");
let id = "fibolint";
_a = new base_extension_1.BaseExtension(id)
    .register(new ping_command_1.PingCmd(id))
    .register(new fibo_number_completion_1.FiboNumberCompletion(id))
    .register(new fibo_number_decoration_1.FiboNumberDecoration(id))
    .register(new test_notebook_1.TestNotebook(id))
    .finalize(), exports.activate = _a[0], exports.deactivate = _a[1];
//# sourceMappingURL=extension.js.map