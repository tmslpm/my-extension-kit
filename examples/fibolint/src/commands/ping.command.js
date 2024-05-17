"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCmd = void 0;
const vscode = __importStar(require("vscode"));
const base_feature_1 = require("my-extension-kit/src/base.feature");
class PingCmd extends base_feature_1.BaseFeature {
    constructor(extensionId) {
        super(extensionId, "ping");
    }
    onRegister() {
        return [
            vscode.commands.registerCommand(this.id, this.callback)
        ];
    }
    callback() {
        vscode.window.showInformationMessage('pong!');
    }
    ;
}
exports.PingCmd = PingCmd;
//# sourceMappingURL=ping.command.js.map