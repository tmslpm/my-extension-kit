# Example

```ts
let id = "fibolint";
export const [activate, deactivate] = new BaseExtension(id)

  // Register a command feature
  .register(new PingCmd(id))

  // Register a completion feature
  .register(new FiboNumberCompletion(id))

  // Register a decoration feature
  .register(new FiboNumberDecoration(id))
  
  .finalize();
```

## See

- `./commands/ping.command.ts`
- `./decorations/fibo-number.decoration.ts`
- `./languages/completions/fibo-number.completion`
- `./notebooks/test.notebook`

<div align="center">

<img
  src="https://github.com/tmslpm/my-extension-kit/blob/main/examples/assets/fibo-ok.png"
  alt="codesnap example" />

<img
  src="https://github.com/tmslpm/my-extension-kit/blob/main/examples/assets/fibo-not-ok.png"
  alt="codesnap example" />
  
</div>
