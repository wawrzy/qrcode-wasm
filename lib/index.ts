import * as loader from '@assemblyscript/loader';
import domtoimage from 'dom-to-image';

interface IWasmInstance extends loader.ASUtil {
	main: (ptr: number) => number;
}

interface IConfig {
	debug?: boolean;
	wasmPath?: string;
}

enum Error {
	Encoding = 10, // Message encoding not supported
	TooLong = 20, // Message too long (maximum size depends on encoding)
}

enum Debug {
	Enable = 1,
	Disable = 0,
}

export const ErrorCodes = {
	ERR_ENC: 'ERR_ENC',
	ERR_TLONG: 'ERR_TLONG',
};

const CodeFromError = {
	[Error.Encoding]: ErrorCodes.ERR_ENC,
	[Error.TooLong]: ErrorCodes.ERR_TLONG,
};

export class QrCodeWasm {
	private debug: boolean;
	private wasmPath: string;

	private wasm: IWasmInstance;
	private memory: WebAssembly.Memory;

	private buffer: Int32Array = null;

	constructor(config: IConfig = {}) {
		this.debug = !!config.debug;
		this.wasmPath = config.wasmPath || 'main.wasm';
	}

	private __DEBUG__ = (): Debug => {
		return this.debug ? Debug.Enable : Debug.Disable;
	};

	private config = () => ({
		DEBUG: this.__DEBUG__,
	});

	private env = (): loader.ImportsObject['env'] => ({
		trace: (msg) => {
			console.log('[TRACE] : ' + this.wasm.__getString(msg)); // For debugging
		},
		memory: this.memory,
	});

	public async encode(message: string): Promise<Int32Array> {
		this.memory = new WebAssembly.Memory({ initial: 1 });

		const instance = await loader.instantiateStreaming(fetch(this.wasmPath), {
			config: this.config(),
			env: this.env(),
		});

		this.wasm = instance as IWasmInstance;

		const ptrMessageToEncore = (this.wasm.__retain as Function)(
			this.wasm.__allocString(message)
		);

		const error = this.wasm.main(ptrMessageToEncore);

		return new Promise((resolve, reject) => {
			if (error !== 0) {
				reject(CodeFromError[error]);
			} else {
				this.buffer = new Int32Array(this.memory.buffer);
				resolve(this.buffer);
			}
		});
	}

	public async png(size: number): Promise<string> {
		const buffer = this.buffer;
		const root = document.createElement('div');
		const initialPosition = root.style.position;
		const initialLeft = root.style.left;

		root.style.position = 'absolute';
		root.style.left = '-10000px';

		const moduleSize = Math.round(size / buffer[0]);

		let line = document.createElement('div');
		line.style.display = 'flex';

		let currentLineIdx = 0;

		for (let i = 1; i < buffer[0] * buffer[0] + 1; i++) {
			if (currentLineIdx === buffer[0]) {
				root.appendChild(line);
				line = document.createElement('div');
				line.style.display = 'flex';

				currentLineIdx = 0;
			}
			const mod = document.createElement('div');

			mod.style.height = `${moduleSize}px`;
			mod.style.width = `${moduleSize}px`;
			mod.style.backgroundColor = buffer[i] === 1 ? 'black' : 'white';

			line.appendChild(mod);
			currentLineIdx += 1;
		}
		root.appendChild(line);

		document.body.appendChild(root);

		const dataUrl = await domtoimage.toPng(root, {
			style: {
				left: initialLeft,
				position: initialPosition,
			},
		});

		document.body.removeChild(root);

		return Promise.resolve(dataUrl);
	}
}
