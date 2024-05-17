"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExtension = void 0;
/**
 * # BaseExtension
 *
 * Example:
 *
 * ```ts
 * let id = "my-awesome-extension";
 * export const [activate, deactivate] = new BaseExtension(id)
 *  .register(new PingCmd(id))
 *  .finalize();
 * ```
 */
class BaseExtension {
    /**
     *  Holds all registered features of the extension.
     */
    _features;
    /**
     * Unique id of the extension
     */
    _id;
    constructor(id) {
        this._features = [];
        this._id = id;
    }
    // Life Cycle Event
    /**
     * activate is executed when the extension is activated.
     *
     * @param { ExtensionContext } ctx - the context
     *
     * @return void
     */
    activate(ctx) {
        this._features.map(v => ctx.subscriptions.push(...v.onRegister(ctx)));
        // Iterate through all features, invoke the onInit
        // method if defined.
        this._features
            .filter(v => v["onInit"] !== undefined)
            .forEach(v => v.onInit());
    }
    /**
     * deactivate is executed when the extension is deactivated.
     *
     * note: gives you a chance to clean up before your extension
     *       becomes deactivated.
     *
     * @return void
     */
    deactivate() {
        // Iterate through all features, invoke the onDestroy
        // method if defined. And reset the features array.
        this._features.filter(v => v["onDestroy"] !== undefined)
            .forEach(v => v.onDestroy());
        this._features = [];
    }
    // Method
    register(feature) {
        this._features.push(feature);
        return this;
    }
    finalize() {
        return [
            this.activate.bind(this),
            this.deactivate.bind(this)
        ];
    }
    // Getter
    get id() {
        return this._id;
    }
}
exports.BaseExtension = BaseExtension;
//# sourceMappingURL=base.extension.js.map