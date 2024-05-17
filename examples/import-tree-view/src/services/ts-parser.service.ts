import {
  FileReference,
  ImportDeclaration,
  PreProcessedFileInfo,
  ScriptTarget,
  SourceFile,
  createSourceFile,
  getLineAndCharacterOfPosition,
  isImportDeclaration,
  isNamedImports,
  isNamespaceImport,
  preProcessFile
} from "typescript";
import { Logger } from "pino";
import { getLogger, has } from "../utils";
import { Subject, Observable } from "rxjs";

/*********************************************/
/* In this file:                             */
/* - class TsParserService                   */
/* - type FileInfoDTO                        */
/* - type ImportDTO                          */
/* - enum ImportType                         */
/*********************************************/

/**
 * # Service: Typescript Parser
 * 
 * Note: The class use a singleton pattern.
 * 
 * Current feature:
 * - find all import from source dode
 * 
 * @author tmslpm
 */
export class TsParserService {
  /**
   * The singleton instance of the this class. 
   */
  private static INSTANCE?: TsParserService = undefined;
  /**
   * A private instance of a pino logger for logging purposes. 
   */
  private readonly _logger: Logger;
  private readonly _subImportParsed: Subject<FileInfoDTO>;
  private readonly _obsImportParsed: Observable<FileInfoDTO>;

  /**
   * Private constructor implementing the Singleton pattern. 
   * Use the static getter method `get()` to access 
   * the Singleton instance.
   */
  private constructor() {
    this._logger = getLogger("service:ts-parser");
    this._logger.info("ts-parser service instantiated");
    this._subImportParsed = new Subject();
    this._obsImportParsed = this._subImportParsed.asObservable();
  }

  public parseImportFromCode(fileName: string, code: string): void {
    let info = this.execPreProcess(code);
    if (!has(info)) {
      return;
    }

    /* create source to visit import declaration to get more info 
     * about the named, namespace and default import. */
    let source = createSourceFile(fileName, code, this.target, true);

    let allPromises: Promise<void[]>[] = [];
    let data = {
      filename: fileName,
      normalImports: [],
      dynamicImports: [],
      libsRef: [],
      filesRef: [],
      typesRef: [],
      externRef: [],
    } as FileInfoDTO;

    allPromises.push(Promise.all(info.importedFiles
      .filter(v => code
        .substring(v.pos - 10, v.pos)
        .replace(/\s+/g, ' ')
        .endsWith("import("))
      .map(v => this.parseReference(v, source)
        .then(r => { data.dynamicImports.push(r); }))
    ));

    allPromises.push(Promise.all(info.libReferenceDirectives
      .map(v => this.parseReference(v, source)
        .then(r => { data.libsRef.push(r); }))
    ));

    allPromises.push(Promise.all(info.referencedFiles
      .map(v => this.parseReference(v, source)
        .then(r => { data.filesRef.push(r); }))
    ));

    allPromises.push(Promise.all(info.typeReferenceDirectives
      .map(v => this.parseReference(v, source)
        .then(r => { data.typesRef.push(r); }))
    ));

    allPromises.push(Promise.all((info.ambientExternalModules || [])
      .map(v => this.parseExternalRef(fileName)
        .then(r => { data.externRef.push(r); }))
    ));

    let importPromiseDecla: Promise<void>[] = [];
    source.forEachChild(node => {
      if (isImportDeclaration(node)) {
        importPromiseDecla.push(this.parseImportDeclaration(node, source)
          .then(arr => {
            data.normalImports.push(...arr);
          })
        );
      }
    });
    allPromises.push(Promise.all(importPromiseDecla));

    Promise.all(allPromises)
      .then(() => this._subImportParsed.next(data));
  }

  private execPreProcess(code: string): PreProcessedFileInfo | undefined {
    /** 
     * if code.length < 7 abandon because no available import
     * ┌─┬─┬─┬─┬─┬─┬─────────────────────────────┐
     * │1│2│3│4│5│6│7...                         │
     * ├─┼─┼─┼─┼─┼─┼─────────────────────────────┤
     * │i│m│p│o│r│t│ Bar from "mym"              │
     * │a│w│a│i│t│ │import("mym")                │
     * │c│o│n│s│t│ │bar = await import("mym")    │
     * └─┴─┴─┴─┴─┴─┴─────────────────────────────┘
     */
    if (code.length < 7) {
      return undefined;
    }

    /* run pre process to find all import.(dynamic, named, ...)*/
    let info = preProcessFile(code);
    let totalImport = info.importedFiles.length
      + info.libReferenceDirectives.length
      + info.referencedFiles.length
      + info.typeReferenceDirectives.length;

    /* if no import found abandon because ... o_o */
    if (totalImport <= 0) {
      return undefined;
    }

    return info;
  }

  private async parseExternalRef(path: string): Promise<ImportDTO> {
    return Promise.resolve({
      line: -1,
      pos: -1,
      text: path,
      path: path,
      type: ImportType.REF
    });
  }

  private async parseReference(file: FileReference, source: SourceFile): Promise<ImportDTO> {
    return Promise.resolve({
      line: getLineAndCharacterOfPosition(source, file.pos).line,
      pos: file.pos,
      text: file.fileName,
      path: file.fileName,
      type: ImportType.REF
    });
  }

  private async parseImportDeclaration(node: ImportDeclaration, source: SourceFile): Promise<ImportDTO[]> {
    if (!has(node.importClause)) {
      return Promise.resolve([]);
    }

    let importDTOs: ImportDTO[] = [];
    let lazyImportPath: string | undefined = undefined;

    if (has(node.importClause.namedBindings)) {
      /*  try find namespace import */
      if (isNamespaceImport(node.importClause.namedBindings)) {
        lazyImportPath = node.moduleSpecifier.getText(source);
        importDTOs.push({
          line: 0,
          pos: node.pos,
          text: node.importClause.namedBindings.name.getText(),
          path: lazyImportPath || "???",
          type: ImportType.NAMED
        });
      }
      /* try find named import */
      else if (isNamedImports(node.importClause.namedBindings)) {
        lazyImportPath = node.moduleSpecifier.getText(source);
        node.importClause.namedBindings.elements
          .forEach(v => importDTOs.push({
            line: 0,
            pos: node.pos,
            text: v.name.getText(source),
            path: lazyImportPath || "???",
            type: ImportType.NAMED
          }));
      }
    }

    /** 
     * try to find default import ElseIf structure not used 
     * because default imports and named import can be true 
     * both in same time. 
     */
    if (has(node.importClause.name)) {
      if (!has(lazyImportPath)) {
        lazyImportPath = node.moduleSpecifier.getText(source);
      }

      importDTOs.push({
        line: 0,
        pos: node.pos,
        text: node.importClause.name.getText(source),
        path: lazyImportPath || "???",
        type: ImportType.DEFAULT
      });
    }

    return Promise.resolve(importDTOs);
  }

  // - - - - - - - - - - - - - - - - - -
  // Getter

  /**
   * Retrieves the singleton instance of the class. 
   * If the instance does not exist, it initializes and 
   * returns it.
   *   
   * @returns {TsParserService} instance of TsParserService
   */
  public static get get(): TsParserService {
    if (TsParserService.INSTANCE === undefined) {
      TsParserService.INSTANCE = new TsParserService();
    }
    return TsParserService.INSTANCE;
  }

  private get target() {
    return ScriptTarget.Latest;
  }

  public get obsImportParsed(): Observable<FileInfoDTO> {
    return this._obsImportParsed;
  }

}

export type FileInfoDTO = {
  filename: string,
  normalImports: ImportDTO[],
  dynamicImports: ImportDTO[],
  libsRef: ImportDTO[],
  filesRef: ImportDTO[],
  typesRef: ImportDTO[],
  externRef: ImportDTO[],
};

export type ImportDTO = {
  line: number,
  pos: number,
  text: string,
  path: string,
  type: ImportType,
};

/**
 * ### Import Type ECMAScript
 * ```js
 * // Default
 * import myDefault from "/modules/my-module";
 * // Dynamic
 * const MY_MODULE = await import("/modules/my-module");  
 * // Namespace
 * import * as MyNamespace from "/modules/my-module";
 * // Named
 * import { myExport } from "/modules/my-module"; 
 * ``` 
 * see [mdn/import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
 */
export enum ImportType {
  /**
   * Default Import:
   * ```js
   * import myDefault from "/modules/my-module";
   * ```
   */
  DEFAULT,

  /** 
   * Dynamic Import:
   * ```js
   * const MY_MODULE = await import("/modules/my-module");  
   * ```
   */
  DYNAMIC,

  /** 
   * Namespace import:
   * ```js
   * import * as MyNamespace from "/modules/my-module";
   * ```
   */
  NAMESPACE,

  /**
   * Named import:
   * ```js
   * import { myExport } from "/modules/my-module";
   * import { foo, bar } from "/modules/my-module";
   * ```
   */
  NAMED,


  /** MAYBE BAD LOGIC */
  UNKNOWN,
  REF,
};
