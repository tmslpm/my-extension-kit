"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasExtension = void 0;
const vscode_1 = require("vscode");
function hasExtension(id) {
    return vscode_1.extensions.getExtension(id) !== undefined;
}
exports.hasExtension = hasExtension;
//# sourceMappingURL=vscode.helper.js.map