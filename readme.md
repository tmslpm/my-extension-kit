# My Extension Kit

## Install

```cli
npm install my-extension-kit
```

## How to use

```ts
// unique identifier of your extension
let id = "my-awesome-extension";

// create the extension
let v = new BaseExtension(id);

// registre ping command 
v.register(new PingCmd(id))

export const [activate, deactivate] = v.finalize();
```

### License MIT

See the [license.md](https://github.com/tmslpm/my-extension-kit/license.md)
