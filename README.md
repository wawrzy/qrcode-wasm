# qrcode-wasm

[DEMO](https://wawrzy.github.io/qrcode-wasm/)

Web Assembly Qrcode generator 

## Usage

```javascript
    import { QrCodeWasm } from 'qrcode-wasm';

    const generator = new QrCodeWasm({ debug: true });

    generator.encode('HELLO WORLD').then((buffer) => {
      // buffer = Int32Array
      // [Size Matrix, 1, 0, 1, 0, 0 ....]
      // 1 = Dark Module
      // 0 = White Module
    });
```

## Build with

[Typescript](https://www.typescriptlang.org/)

[Assemblyscript](https://docs.assemblyscript.org/)
