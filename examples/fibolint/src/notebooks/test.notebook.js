"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestNotebook = void 0;
const vscode_1 = require("vscode");
const util_1 = require("util");
const base_feature_1 = require("my-extension-kit/src/base.feature");
const pino_1 = __importDefault(require("pino"));
/**
 * # Test Feature Notebook
 *
 * ## Required
 *
 * ### 1) In the package.json:
 * ```json
 * {
 *   ...
 *   "contributes": {
 *     "notebooks": [
 *      {
 *        "type": "fibolint.my-notebook",
 *        "displayName": "My Notebook",
 *        "selector": [{ "filenamePattern": "*.notebook" }]
 *       }
 *     ]
 *   }
 * }
 * ```
 *
 * ### 2) In extension.ts
 * ```ts
 * export const [activate, deactivate] = new BaseExtension(id)
 *    .register(new TestNotebook(id))
 *    .finalize();
 * ```
 */
class TestNotebook extends base_feature_1.BaseFeature {
    _textDecoder;
    _textEncoder;
    _logger;
    constructor(extensionId) {
        super(extensionId, "my-notebook");
        this._logger = (0, pino_1.default)({
            name: "test:my-notebook",
            level: "info"
        });
    }
    onRegister() {
        return [
            vscode_1.workspace.registerNotebookSerializer(this.id, this)
        ];
    }
    onInit() {
        this._textDecoder = new util_1.TextDecoder();
        this._textEncoder = new util_1.TextEncoder();
    }
    onDestroy() {
        super.onDestroy();
        this._textDecoder = undefined;
        this._textEncoder = undefined;
    }
    async deserializeNotebook(data, token) {
        if (this._textDecoder === undefined) {
            this._logger.error("TextDecoder undefined");
            return Promise.reject("TextDecoder undefined");
        }
        let raw;
        try {
            raw = JSON.parse(this._textDecoder.decode(data));
        }
        catch (e) {
            this._logger.error("JSON.parse => ", e);
            return Promise.reject(e);
        }
        return raw["cells"] === undefined
            ? new vscode_1.NotebookData([])
            : new vscode_1.NotebookData(raw.cells.map(this.deserializeCell));
    }
    async serializeNotebook(data, token) {
        if (this._textEncoder === undefined) {
            this._logger.error("TextEncoder undefined");
            return Promise.reject("TextEncoder undefined");
        }
        let serialized;
        try {
            serialized = JSON.stringify(data.cells.map(this.serializeCell));
        }
        catch (e) {
            this._logger.error("JSON.stringify  => ", e);
            return Promise.reject(e);
        }
        return Promise.resolve(this._textEncoder.encode(serialized));
    }
    serializeCell(cell) {
        return {
            cell_type: cell.kind === vscode_1.NotebookCellKind.Code
                ? "code"
                : "markdown",
            source: cell.value.split(/\r?\n/g)
        };
    }
    deserializeCell(cell) {
        return new vscode_1.NotebookCellData(cell.cell_type === 'code'
            ? vscode_1.NotebookCellKind.Code
            : vscode_1.NotebookCellKind.Markup, cell.source.join('\n'), cell.cell_type === 'code'
            ? 'python'
            : 'markdown');
    }
}
exports.TestNotebook = TestNotebook;
//# sourceMappingURL=test.notebook.js.map