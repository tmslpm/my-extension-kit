<div align="center">

# My Extension Kit

![codesnap example](https://raw.githubusercontent.com/tmslpm/my-extension-kit/main/examples/assets/codesnap-1.png)

</div>

## Install  

```sh
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

## Docs

[https://tmslpm.github.io/my-extension-kit/](https://tmslpm.github.io/my-extension-kit/)

<div align="center">

## Example: Extension Fibolink

![codesnap example](https://raw.githubusercontent.com/tmslpm/my-extension-kit/main/examples/assets/fibo-ok.png)

![codesnap example](https://raw.githubusercontent.com/tmslpm/my-extension-kit/main/examples/assets/fibo-ok.png)

</div>

<div align="center">

## Example: Extension ImportTreeView

![codesnap example](https://raw.githubusercontent.com/tmslpm/my-extension-kit/main/examples/assets/tree-0.png)

![codesnap example](https://raw.githubusercontent.com/tmslpm/my-extension-kit/main/examples/assets/tree-1.png)

</div>

### License MIT

See the [license.md](https://github.com/tmslpm/my-extension-kit/blob/main/license.md)

<pre align=center>↑↑↑ <a href="#my-extension-kit" title="click to scroll up" alt="click to scroll up">BACK TO TOP</a> ↑↑↑</pre>
