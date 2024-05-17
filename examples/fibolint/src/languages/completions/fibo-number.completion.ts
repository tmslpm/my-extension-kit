import {
  languages,
  Disposable,
  SnippetString,
  CompletionItem,
  CompletionItemProvider,
} from "vscode";
import { BaseFeature } from "../../base/base.feature";

export class FiboNumberCompletion extends BaseFeature
  implements CompletionItemProvider<CompletionItem> {

  public constructor(extensionId: string) {
    super(extensionId, "fibo-number-completion");
  }

  public onRegister(): Disposable[] {
    return [
      languages.registerCompletionItemProvider([
        { scheme: 'file', language: '*' }
      ], this)
    ];
  }

  public provideCompletionItems(): CompletionItem[] {
    let SEQUENCES: string[] = [
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
      let item = new CompletionItem(label);
      item.insertText = new SnippetString(v);
      return item;
    });
  }

}
