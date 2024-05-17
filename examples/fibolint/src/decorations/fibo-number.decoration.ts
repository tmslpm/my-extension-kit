
import {
  Range,
  window,
  workspace,
  TextEditor,
  Disposable,
  ExtensionContext,
  DecorationOptions,
  TextDocumentChangeEvent,
  TextEditorDecorationType,
} from "vscode";
import { FibonacciService } from "../services/fibonacci.service";
import { tryParseInt } from "../base/base.utils";
import { BaseFeature } from "../base/base.feature";

export class FiboNumberDecoration extends BaseFeature {

  private static readonly THROTTLE_DELAY = 500;
  private static readonly REGEX_NUMBER = /\d+/g;

  private _editor?: TextEditor;
  private _timeout?: any;
  private _decoFiboNum: TextEditorDecorationType;
  private _decoNoFiboNum: TextEditorDecorationType;

  public constructor(extensionId: string) {
    super(extensionId, "fibo-number");
    this._editor = undefined;
    this._timeout = undefined;
    this._decoFiboNum = this.getDeco(`${extensionId}.highlightColorFiboNumber`, true);
    this._decoNoFiboNum = this.getDeco(`${extensionId}.highlightColorNotFiboNumber`, false);
  }

  // Event

  public onRegister(ctx: ExtensionContext): Disposable[] {
    return [
      workspace.onDidChangeTextDocument(
        (e) => this.onChangeText(e), null, ctx.subscriptions),
      window.onDidChangeActiveTextEditor(
        (e) => this.onChangeEditor(e), null, ctx.subscriptions)
    ];
  }

  public onInit(): void {
    this._editor = window.activeTextEditor;
    this.onUpdate(false);
  }

  public override onDestroy(): void {
    super.onDestroy();
    this.clearTimeout();
  }

  public onChangeEditor(editor?: TextEditor): void {
    this._editor = editor;
    this.onUpdate(false);
  }

  public onChangeText(e: TextDocumentChangeEvent): void {
    if (this._editor && e.document === this._editor.document) {
      this.onUpdate(true);
    }
  }

  public onUpdate(throttle: boolean): void {
    this.clearTimeout();
    if (throttle) {
      this._timeout = setTimeout(
        () => this.updateDecorations(),
        FiboNumberDecoration.THROTTLE_DELAY
      );
    } else {
      this.updateDecorations();
    }
  }

  // Method

  private clearTimeout() {
    if (this._timeout !== undefined) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  private updateDecorations(): void {
    if (this._editor === undefined) {
      return;
    }

    let doc = this._editor.document;
    let text = this._editor.document.getText();
    let fiboNum: DecorationOptions[] = [];
    let fiboNoNum: DecorationOptions[] = [];
    let match;

    let numberMathed: string = "";
    let numberParsed: number | undefined = undefined;
    while ((match = FiboNumberDecoration.REGEX_NUMBER.exec(text))) {
      numberMathed = match[0];
      numberParsed = tryParseInt(match[0]);

      if (numberParsed !== undefined && !isNaN(numberParsed)) {

        let decorationOptions: DecorationOptions = {
          range: new Range(
            doc.positionAt(match.index),
            doc.positionAt(match.index + numberMathed.length)
          )
        };

        if (FibonacciService.isNumFibo(numberParsed)) {
          decorationOptions.hoverMessage = this.generateHoverText(numberParsed);
          fiboNum.push(decorationOptions);
        } else {
          decorationOptions.hoverMessage = `Oops ! Looks like this number is not Fibonacci material.`;
          fiboNoNum.push(decorationOptions);
        }
      }
    }

    this._editor.setDecorations(this._decoFiboNum, fiboNum);
    this._editor.setDecorations(this._decoNoFiboNum, fiboNoNum);
  }

  private getDeco(id: string, isFibo: boolean): TextEditorDecorationType {
    return window.createTextEditorDecorationType({
      color: { id: id },
      light: {
        fontWeight: isFibo ? "600" : "initial",
      },
      dark: {
        fontWeight: isFibo ? "600" : "initial",
      }
    });
  }

  private generateHoverText(fiboNum: number): string {
    let fiboIdx = FibonacciService.getPosInFiboSequence(fiboNum);
    let prev = FibonacciService.getFiboNumberFromPos(fiboIdx - 1);
    let next = FibonacciService.getFiboNumberFromPos(fiboIdx + 1);

    let fiboPos = fiboIdx === 1
      ? "**F1** or **F2**"
      : `**F${fiboIdx}**`;

    let ratio = fiboNum === 0 || prev === 0 ? 0 : (fiboNum / prev);
    let minValidRatio = FibonacciService.PHI - .3;
    let maxValidRatio = FibonacciService.PHI + .3;
    let goodRatio = ratio > minValidRatio && ratio < maxValidRatio
      ? "✅"
      : "❎";

    let msg = `Fibonacci Number **${fiboNum}** [${fiboPos}]`
      + `\n\n**previous**: ${prev} `
      + `\n\n**next**: ${next} `
      // ratio
      + `\n\n**golden ratio** ${fiboNum}/${prev} = ${ratio.toFixed(6)} ${goodRatio}`;
    return msg;
  }

}
