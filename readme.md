<div align="center">

# My Extension Kit

<img
  src="https://github.com/tmslpm/my-extension-kit/blob/main/examples/assets/codesnap-1.png"
  alt="codesnap example" />

</div>

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

## Docs

[https://tmslpm.github.io/my-extension-kit/](https://tmslpm.github.io/my-extension-kit/)

### License MIT

See the [license.md](https://github.com/tmslpm/my-extension-kit/blob/main/license.md)

<pre align=center>↑↑↑ <a href="#my-extension-kit" title="click to scroll up" alt="click to scroll up">BACK TO TOP</a> ↑↑↑</pre>
