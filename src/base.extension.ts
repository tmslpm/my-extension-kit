import * as vscode from 'vscode';
import { BaseFeature } from "./base.feature";

/**
 * ```ts
 * let id = "my-awesome-extension";
 * export const [activate, deactivate] = new BaseExtension(id)
 *  .register(new PingCmd(id))
 *  .finalize();
 * ```
 */
export class BaseExtension implements OnActivate, OnDeactivate {

  /**
   *  Holds all registered features of the extension.
   */
  private _features: BaseFeature[];

  public constructor(id: string) {
    this._features = [];
  }

  // Life Cycle Event

  /**
   * activate is executed when the extension is activated.
   *   
   * @param { ExtensionContext } ctx - the context
   * 
   * @return void
   */
  public activate(ctx: vscode.ExtensionContext): any {
    this._features.map(v =>
      ctx.subscriptions.push(...v.onRegister(ctx)));

    // Iterate through all features, invoke the onInit
    // method if defined.
    this._features
      .filter(v => v["onInit"] !== undefined)
      .forEach(v => v.onInit!());
  }

  /**
   * deactivate is executed when the extension is deactivated.
   * 
   * note: gives you a chance to clean up before your extension 
   *       becomes deactivated.
   *  
   * @return void
   */
  public deactivate(): void {
    // Iterate through all features, invoke the onDestroy
    // method if defined. And reset the features array.
    this._features.filter(v => v["onDestroy"] !== undefined)
      .forEach(v => v.onDestroy!());
    this._features = [];
  }

  // Method

  public register(feature: BaseFeature): BaseExtension {
    this._features.push(feature);
    return this;
  }

  public finalize() {
    return [
      this.activate.bind(this),
      this.deactivate.bind(this)
    ];
  }

}

export type OnActivate = {
  activate: (ctx: vscode.ExtensionContext) => any
};

export type OnDeactivate = {
  deactivate: () => void
};
