
import { ExtensionContext, Disposable } from "vscode";

/**
 * # BaseFeature
 * 
 * Abstract base class for feature implementations.
 * To be registered with the base.extension class, 
 * which will manage the lifecycle. 
 * 
 * template:
 * 
 * ```ts
 * export class ImportFoldingLanguage extends BaseFeature {
 *   public constructor(extensionId: string) {
 *     super(extensionId, "my-unique-feature-id");
 *   }
 * 
 *   public onRegister(ctx: ExtensionContext): Disposable[] {
 *     return [ ... ];
 *   }
 *
 *   public onInit(): void { }
 *   
 * }
 * ```
 */
export abstract class BaseFeature {

  /**
   * Identifier for the feature.
   * syntax: `{{ extension-id }}.{{feature-id}}`    
   */
  protected readonly _id: string;

  /**
   * Array to hold disposable resources. 
   * 
   * See: 
   *  {@link onRegister}(),
   *  {@link onDestroy}(), 
   *  {@link disposes}()
   */
  private disposables: Disposable[];

  /**
   * Creates an instance of `BaseFeatue`.
   * @param {string} extensionId The unique identifier of your extension.
   * @param {string} featureId The unique identifier of your feature.
   */
  public constructor(extensionId: string, featureId: string) {
    this._id = `${extensionId}.${featureId}`;
    this.disposables = [];
  }

  public abstract onRegister(ctx: ExtensionContext): Disposable[];

  public onInit?(): void;

  public onDestroy(): void {
    this.disposes();
  };

  public disposes(): void {
    this.disposables.forEach(v => v.dispose());
    this.disposables = [];
  }

  public get id(): string { return this._id; }

}
