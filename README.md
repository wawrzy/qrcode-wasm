# qrcode-wasm

[DEMO](https://wawrzy.github.io/qrcode-wasm/)

Web Assembly Qrcode generator

## Usage

```javascript
import { QrCodeWasm } from 'qrcode-wasm';

const generator = new QrCodeWasm({ debug: true });

await generator.encode('HELLO WORLD').then((buffer) => {
	// buffer = Int32Array
	// [Side size of Matrix (total size = Side Size * Side Size), 1, 0, 1, 0, 0 ....]
	// 1 = Dark Module
	// 0 = White Module
});

const dataURL = await generator.png(200 /* PNG size in Pixel */);
```

### Webpack

If you want to use this package with webpack you must include the main.wasm file in your build output. You can customize the name or path to this file with the `wasmPath` option.

```javascript
const generator = new QrCodeWasm({ wasmPath: 'scripts/custom.wasm' });
```

## Errors

| CODE      | DESCRIPTION                    |
| --------- | ------------------------------ |
| ERR_ENC   | Message encoding not supported |
| ERR_TLONG | Message is too long            |

## Build with

[Typescript](https://www.typescriptlang.org/)

[Assemblyscript](https://docs.assemblyscript.org/)
