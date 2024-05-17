import {
  workspace,
  NotebookData,
  NotebookCellData,
  NotebookCellKind,
  CancellationToken,
  NotebookSerializer,
} from "vscode";
import { TextDecoder, TextEncoder } from 'util';
import { Disposable } from "vscode";
import pino, { Logger } from "pino";
import { BaseFeature } from "my-extension-kit/base.feature";

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
export class TestNotebook extends BaseFeature implements NotebookSerializer {
  private _textDecoder?: TextDecoder;
  private _textEncoder?: TextEncoder;
  private _logger: Logger;

  public constructor(extensionId: string) {
    super(extensionId, "my-notebook");
    this._logger = pino({
      name: "test:my-notebook",
      level: "info"
    });
  }

  public onRegister(): Disposable[] {
    return [
      workspace.registerNotebookSerializer(this.id, this)
    ];
  }

  public onInit(): void {
    this._textDecoder = new TextDecoder();
    this._textEncoder = new TextEncoder();
  }

  public override onDestroy(): void {
    super.onDestroy();
    this._textDecoder = undefined;
    this._textEncoder = undefined;
  }

  public async deserializeNotebook(data: Uint8Array, token: CancellationToken): Promise<NotebookData> {
    if (this._textDecoder === undefined) {
      this._logger.error("TextDecoder undefined");
      return Promise.reject("TextDecoder undefined");
    }

    let raw: RawNotebook;
    try {
      raw = JSON.parse(this._textDecoder.decode(data));
    } catch (e) {
      this._logger.error("JSON.parse => ", e);
      return Promise.reject(e);
    }

    return raw["cells"] === undefined
      ? new NotebookData([])
      : new NotebookData(raw.cells.map(this.deserializeCell));
  }

  public async serializeNotebook(data: NotebookData, token: CancellationToken): Promise<Uint8Array> {
    if (this._textEncoder === undefined) {
      this._logger.error("TextEncoder undefined");
      return Promise.reject("TextEncoder undefined");
    }

    let serialized: string;
    try {
      serialized = JSON.stringify(data.cells.map(this.serializeCell));
    } catch (e) {
      this._logger.error("JSON.stringify  => ", e);
      return Promise.reject(e);
    }

    return Promise.resolve(this._textEncoder.encode(serialized));
  }

  private serializeCell(cell: NotebookCellData): RawNotebookCell {
    return {
      cell_type: cell.kind === NotebookCellKind.Code
        ? "code"
        : "markdown",
      source: cell.value.split(/\r?\n/g)
    };
  }

  private deserializeCell(cell: RawNotebookCell): NotebookCellData {
    return new NotebookCellData(
      cell.cell_type === 'code'
        ? NotebookCellKind.Code
        : NotebookCellKind.Markup,
      cell.source.join('\n'),
      cell.cell_type === 'code'
        ? 'python'
        : 'markdown'
    );
  }

}

export interface RawNotebook {
  cells: RawNotebookCell[];
}

export interface RawNotebookCell {
  source: string[];
  cell_type: 'code' | 'markdown';
}
