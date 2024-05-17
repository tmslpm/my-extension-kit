import {
  Disposable,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  Event,
  window,
  TreeItemCollapsibleState,
  ExtensionContext,
  TextEditor,
  workspace,
  TextDocumentChangeEvent,
  CancellationToken,
  ProviderResult,
  Uri,
  ThemeIcon
} from "vscode";
import { BaseFeature } from "my-extension-kit/base.feature";
import { FileInfoDTO, TsParserService } from "../services/ts-parser.service";
import { Subscription } from "rxjs";
import { has } from "../utils";

export class ImportExplorer extends BaseFeature
  implements TreeDataProvider<ImportItem> {
  private _subscriptions: Subscription[];
  private _editor?: TextEditor;
  private _timeout?: any;
  private readonly _emitterChangeTreeData: EventEmitter<EventChangeTreeDate>;
  public readonly onDidChangeTreeData: Event<EventChangeTreeDate>;
  private _category: CategoryImportExplorer;

  public constructor(extensionId: string) {
    super(extensionId, "import-explorer");
    this._subscriptions = [];
    this._editor = undefined;
    this._timeout = undefined;
    this._category = {
      normalImports: new CategoryImportItem("Normal Import"),
      dynamicImports: new CategoryImportItem("Dynamic Import"),
      libsRef: new CategoryImportItem("Referenced Library"),
      filesRef: new CategoryImportItem("Referenced Files"),
      typesRef: new CategoryImportItem("Referenced Types"),
      externRef: new CategoryImportItem("Referenced External Modules "),
    };

    this._emitterChangeTreeData = new EventEmitter();
    this.onDidChangeTreeData = this._emitterChangeTreeData.event;
  }

  public onRegister(ctx: ExtensionContext): Disposable[] {
    return [
      window.createTreeView(this._id, {
        treeDataProvider: this,
        showCollapseAll: true,
      }),

      workspace.onDidChangeTextDocument(
        (e) => this.onChangeText(e), null, ctx.subscriptions),

      window.onDidChangeActiveTextEditor(
        (e) => this.onChangeEditor(e), null, ctx.subscriptions)
    ];
  }

  public onInit(): void {
    this._subscriptions = [
      TsParserService.get.obsImportParsed.subscribe(v => this.onRecieveParsedImport(v))
    ];
    this._editor = window.activeTextEditor;
    this.requestParseImport();
  }

  public override onDestroy(): void {
    super.onDestroy();
    this.clearTimeout();
    this._subscriptions.forEach(v => v.unsubscribe());
    this._subscriptions = [];
  }

  public onChangeEditor(editor?: TextEditor): void {
    this._editor = editor;
    this.clearTimeout();
    this.requestParseImport();
  }

  public onChangeText(e: TextDocumentChangeEvent): void {
    if (has(this._editor) && e.document === this._editor.document) {
      this.clearTimeout();
      this._timeout = setTimeout(() => this.requestParseImport(), 600);
    }
  }

  public requestParseImport() {
    // clear current data
    this._category.dynamicImports.clear();
    this._category.normalImports.clear();
    this._category.libsRef.clear();
    this._category.filesRef.clear();
    this._category.typesRef.clear();
    this._category.externRef.clear();
    this._emitterChangeTreeData.fire();

    // if has editor request
    if (has(this._editor)) {
      TsParserService.get.parseImportFromCode(
        this._editor.document.fileName,
        this._editor.document.getText()
      );
    }
  }

  public onRecieveParsedImport(data: FileInfoDTO) {
    let mapImportSorted = new Map<string, CategoryImportItem>();
    data.normalImports.forEach(v => {
      if (mapImportSorted.has(v.path)) {
        mapImportSorted.get(v.path)!.push(new ImportItem(v.text));
      } else {
        let fromCategory = new CategoryImportItem(`from ${v.path}`);
        fromCategory.set = [new ImportItem(v.text)];
        mapImportSorted.set(v.path, fromCategory);
      }
    });

    this._category.normalImports.set = Array.from(mapImportSorted.values());

    this._category.dynamicImports.set = data.dynamicImports
      .map(v => new ImportItem(v.text));

    this._category.libsRef.set = data.libsRef
      .map(v => new ImportItem(v.text));

    this._category.filesRef.set = data.filesRef
      .map(v => new ImportItem(v.text));

    this._category.typesRef.set = data.typesRef
      .map(v => new ImportItem(v.text));

    this._category.externRef.set = data.externRef
      .map(v => new ImportItem(v.text));

    this._emitterChangeTreeData.fire();
  }

  private clearTimeout() {
    if (has(this._timeout)) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  public getTreeItem(element: ImportItem): TreeItem {
    return element;
  }

  public getChildren(element?: ImportItem): Thenable<ImportItem[]> {
    if (!has(element)) {
      let category = [
        this._category.normalImports,
        this._category.dynamicImports,
        this._category.libsRef,
        this._category.filesRef,
        this._category.typesRef,
        this._category.externRef
      ].filter(category => category.length > 0);
      return Promise.resolve(category);
    } else {
      return Promise.resolve((element as CategoryImportItem).children);
    }
  }
  public provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
    return Promise.resolve("dqzdqzdq");
  }
}

export class ImportItem extends TreeItem {
  protected _children: ImportItem[];

  public constructor(label: string, children: ImportItem[] = []) {
    super(label, TreeItemCollapsibleState.None);
    this._children = children;
    this.iconPath = new ThemeIcon("package");
  }

}

export class CategoryImportItem extends ImportItem {
  public get children(): ImportItem[] { return this._children; }
  public get length(): number { return this._children.length; }

  public constructor(label: string) {
    super(label, []);
    this.iconPath = new ThemeIcon("extensions");
  }

  public updateCollapse() {
    this.collapsibleState = this.children.length > 0
      ? TreeItemCollapsibleState.Collapsed
      : TreeItemCollapsibleState.None;
  }

  public set set(v: ImportItem[]) {
    this._children = v;
    this.updateCollapse();
  }

  public push(...args: ImportItem[]): void {
    this._children.push(...args);
    this.updateCollapse();
  }

  public clear() {
    this._children = [];
    this.updateCollapse();
  }

}

export type CategoryImportExplorer = {
  normalImports: CategoryImportItem,
  dynamicImports: CategoryImportItem,
  libsRef: CategoryImportItem,
  filesRef: CategoryImportItem,
  typesRef: CategoryImportItem,
  externRef: CategoryImportItem,
};

export type EventChangeTreeDate = ImportItem[]
  | ImportItem
  | undefined
  | null
  | void;

