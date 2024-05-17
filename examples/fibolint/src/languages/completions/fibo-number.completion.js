"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiboNumberCompletion = void 0;
const vscode_1 = require("vscode");
const base_feature_1 = require("my-extension-kit/src/base.feature");
class FiboNumberCompletion extends base_feature_1.BaseFeature {
    constructor(extensionId) {
        super(extensionId, "fibo-number-completion");
    }
    onRegister() {
        return [
            vscode_1.languages.registerCompletionItemProvider([
                { scheme: 'file', language: '*' }
            ], this)
        ];
    }
    provideCompletionItems() {
        let SEQUENCES = [
            "0, 1",
            "0, 1, 1",
            "0, 1, 1, 2",
            "0, 1, 1, 2, 3",
            "0, 1, 1, 2, 3, 5",
            "0, 1, 1, 2, 3, 5, 8",
            "0, 1, 1, 2, 3, 5, 8, 13",
            "0, 1, 1, 2, 3, 5, 8, 13, 21",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025",
            "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393",
        ];
        return SEQUENCES.map((v, i) => {
            let label = `fibo${i + 1}`;
            let item = new vscode_1.CompletionItem(label);
            item.insertText = new vscode_1.SnippetString(v);
            return item;
        });
    }
}
exports.FiboNumberCompletion = FiboNumberCompletion;
//# sourceMappingURL=fibo-number.completion.js.map