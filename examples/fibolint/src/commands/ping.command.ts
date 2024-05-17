import { BaseFeature } from "my-extension-kit/base.feature";
import * as vscode from "vscode";

export class PingCmd extends BaseFeature {

  public constructor(extensionId: string) {
    super(extensionId, "ping");
  }

  public onRegister(): vscode.Disposable[] {
    return [
      vscode.commands.registerCommand(this.id, this.callback)
    ];
  }

  public callback(): void {
    vscode.window.showInformationMessage('pong!');
  };

}
