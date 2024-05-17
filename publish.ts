import * as process from "node:child_process";
import * as fs from "node:fs";
import * as packageJson from './package.json';
import { exit } from "node:process";

const DEV = false;
const OUTPUT = "./build";
const NPM_VERSION_PACKAGE = getVersionPackage(packageJson.name);

let str = "prepare deploying package..."
  + `\n - dev = ${DEV}`
  + `\n - output = ${OUTPUT}`
  + `\n - npm pkg version = ${NPM_VERSION_PACKAGE}`
  + `\n - local pkg version = ${packageJson.version}`;
console.log(str);

// COPY REQUIRED FILE TO BUILD FOLDER
[
  copy("./package.json", `${OUTPUT}/package.json`),
  copy("./readme.md", `${OUTPUT}/readme.md`),
  copy("./license.md", `${OUTPUT}/license.md`),
].forEach(v => {
  if (!v) {
    throw new Error(`Aie!!! File not copied to ${OUTPUT}`);
  }
});

// COMPILE AND NPM PACK 
exec("npm run compile");
exec("cd build && npm pack");

if (NPM_VERSION_PACKAGE === packageJson.version) {
  error("\n======================================================"
    + "\n Cancelled publish package to npm"
    + "\n   - reason: same version"
    + "\n   - fix: bump version and retry"
    + "\n======================================================"
  );
}

////////////////////////////////////////////////////////////////
///                        END END END                       ///
////////////////////////////////////////////////////////////////

function copy(src: string, dist: string): boolean {
  try {
    fs.copyFileSync(src, dist);
    console.log(`${src} copied to ${dist}`);
    return true;
  } catch (e) {
    error(`error ${src} not copied to ${dist}`);
    error(e);
    return false;
  }
}

function exec(task: string, exitIfError = true): boolean {
  try {
    process.execSync(task);
    console.log(`[SUCCESS] > ${task}`);
    return true;
  } catch (e) {
    error(`[FAILLED] > ${task}`);
    error(e);
    if (exitIfError) { exit(-1); }
    return false;
  }
}

function getVersionPackage(name: string): string | undefined {
  try {
    return process.execSync(`npm show ${name} version`).toString().trim();
  } catch (e) {
    error("getVersionPackage catched error", e);
    return undefined;
  }
}

function error(msg: any, ...args: any): void {
  console.error(`\u001B[31m${msg}\u001B[0m`, ...args);
}
