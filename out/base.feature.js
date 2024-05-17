"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFeature = void 0;
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
class BaseFeature {
    /**
     * Identifier for the feature.
     * syntax: `{{ extension-id }}.{{feature-id}}`
     */
    _id;
    /**
     * Array to hold disposable resources.
     *
     * See:
     *  {@link onRegister}(),
     *  {@link onDestroy}(),
     *  {@link disposes}()
     */
    disposables;
    /**
     * Creates an instance of `BaseFeatue`.
     * @param {string} name The name of the completion feature.
     */
    constructor(extensionId, featureId) {
        this._id = `${extensionId}.${featureId}`;
        this.disposables = [];
    }
    onDestroy() {
        this.disposes();
    }
    ;
    disposes() {
        this.disposables.forEach(v => v.dispose());
        this.disposables = [];
    }
    get id() { return this._id; }
}
exports.BaseFeature = BaseFeature;
//# sourceMappingURL=base.feature.js.map