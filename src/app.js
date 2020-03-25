import loader from '@assemblyscript/loader'

let wasm = null

loader
	.instantiateStreaming(fetch('./wasm/main.wasm'), {
		config: {
			test: () => 42,
		},
		env: {
			trace: (msg) => {
				console.log(wasm.__getString(msg))
			},
		},
	})
	.then((instance) => {
		wasm = instance
		console.log(instance.main())
	})
	.catch(console.error)
