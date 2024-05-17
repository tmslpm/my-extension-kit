"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiboNumberDecoration = void 0;
const vscode_1 = require("vscode");
const fibonacci_service_1 = require("../services/fibonacci.service");
const base_feature_1 = require("my-extension-kit/src/base.feature");
class FiboNumberDecoration extends base_feature_1.BaseFeature {
    static THROTTLE_DELAY = 500;
    static REGEX_NUMBER = /\d+/g;
    _editor;
    _timeout;
    _decoFiboNum;
    _decoNoFiboNum;
    constructor(extensionId) {
        super(extensionId, "fibo-number");
        this._editor = undefined;
        this._timeout = undefined;
        this._decoFiboNum = this.getDeco(`${extensionId}.highlightColorFiboNumber`, true);
        this._decoNoFiboNum = this.getDeco(`${extensionId}.highlightColorNotFiboNumber`, false);
    }
    // Event
    onRegister(ctx) {
        return [
            vscode_1.workspace.onDidChangeTextDocument((e) => this.onChangeText(e), null, ctx.subscriptions),
            vscode_1.window.onDidChangeActiveTextEditor((e) => this.onChangeEditor(e), null, ctx.subscriptions)
        ];
    }
    onInit() {
        this._editor = vscode_1.window.activeTextEditor;
        this.onUpdate(false);
    }
    onDestroy() {
        super.onDestroy();
        this.clearTimeout();
    }
    onChangeEditor(editor) {
        this._editor = editor;
        this.onUpdate(false);
    }
    onChangeText(e) {
        if (this._editor && e.document === this._editor.document) {
            this.onUpdate(true);
        }
    }
    onUpdate(throttle) {
        this.clearTimeout();
        if (throttle) {
            this._timeout = setTimeout(() => this.updateDecorations(), FiboNumberDecoration.THROTTLE_DELAY);
        }
        else {
            this.updateDecorations();
        }
    }
    // Method
    clearTimeout() {
        if (this._timeout !== undefined) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
    }
    updateDecorations() {
        if (this._editor === undefined) {
            return;
        }
        let doc = this._editor.document;
        let text = this._editor.document.getText();
        let fiboNum = [];
        let fiboNoNum = [];
        let match;
        let numberMathed = "";
        let numberParsed = undefined;
        while ((match = FiboNumberDecoration.REGEX_NUMBER.exec(text))) {
            numberMathed = match[0];
            try {
                numberParsed = parseInt(match[0]);
            }
            catch (error) {
                numberParsed = undefined;
            }
            if (numberParsed !== undefined && !isNaN(numberParsed)) {
                let decorationOptions = {
                    range: new vscode_1.Range(doc.positionAt(match.index), doc.positionAt(match.index + numberMathed.length))
                };
                if (fibonacci_service_1.FibonacciService.isNumFibo(numberParsed)) {
                    decorationOptions.hoverMessage = this.generateHoverText(numberParsed);
                    fiboNum.push(decorationOptions);
                }
                else {
                    decorationOptions.hoverMessage = `Oops ! Looks like this number is not Fibonacci material.`;
                    fiboNoNum.push(decorationOptions);
                }
            }
        }
        this._editor.setDecorations(this._decoFiboNum, fiboNum);
        this._editor.setDecorations(this._decoNoFiboNum, fiboNoNum);
    }
    getDeco(id, isFibo) {
        return vscode_1.window.createTextEditorDecorationType({
            color: { id: id },
            light: {
                fontWeight: isFibo ? "600" : "initial",
            },
            dark: {
                fontWeight: isFibo ? "600" : "initial",
            }
        });
    }
    generateHoverText(fiboNum) {
        let fiboIdx = fibonacci_service_1.FibonacciService.getPosInFiboSequence(fiboNum);
        let prev = fibonacci_service_1.FibonacciService.getFiboNumberFromPos(fiboIdx - 1);
        let next = fibonacci_service_1.FibonacciService.getFiboNumberFromPos(fiboIdx + 1);
        let fiboPos = fiboIdx === 1
            ? "**F1** or **F2**"
            : `**F${fiboIdx}**`;
        let ratio = fiboNum === 0 || prev === 0 ? 0 : (fiboNum / prev);
        let minValidRatio = fibonacci_service_1.FibonacciService.PHI - .3;
        let maxValidRatio = fibonacci_service_1.FibonacciService.PHI + .3;
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
exports.FiboNumberDecoration = FiboNumberDecoration;
//# sourceMappingURL=fibo-number.decoration.js.map