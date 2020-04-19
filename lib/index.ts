import * as loader from '@assemblyscript/loader';

interface IWasmInstance extends loader.ASUtil {
	main: (ptr: number, errorLevel: number) => number;
}

interface IConfig {
	debug?: boolean;
}

enum Error {
	Encoding = 10, // Message encoding not supported
	TooLong = 20, // Message too long (maximum size depends on encoding)
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
	private wasm: IWasmInstance;
	private memory: WebAssembly.Memory;

	constructor(config: IConfig = {}) {
		this.debug = !!config.debug;
	}

	private __DEBUG__ = (): 0 | 1 => {
		return this.debug ? 1 : 0;
	};

	private config = () => ({
		DEBUG: this.__DEBUG__,
	});

	private env = (): loader.ImportsObject['env'] => ({
		trace: (msg) => {
			console.log('[TRACE] : ' + this.wasm.__getString(msg));
		},
		memory: this.memory,
	});

	public async encode(message: string): Promise<Int32Array> {
		this.memory = new WebAssembly.Memory({ initial: 1 });

		const instance = await loader.instantiateStreaming(fetch('./main.wasm'), {
			config: this.config(),
			env: this.env(),
		});

		console.log(instance);

		this.wasm = instance as IWasmInstance;

		const ptrMessageToEncore = (this.wasm.__retain as Function)(
			this.wasm.__allocString(message)
		);

		const error = this.wasm.main(ptrMessageToEncore, 3);

		return new Promise((resolve, reject) => {
			if (error !== 0) {
				reject(CodeFromError[error]);
			} else {
				resolve(new Int32Array(this.memory.buffer));
			}
		});
	}
}