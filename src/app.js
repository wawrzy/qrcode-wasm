import loader from '@assemblyscript/loader'

let wasm = null

loader
	.instantiateStreaming(fetch('./wasm/main.wasm'), {
		// Should only be functions
		config: {
			DEBUG: () => 1, // 0 == false, 1 == true
		},
		env: {
			trace: (msg) => {
				console.log('[TRACE] : ' + wasm.__getString(msg))
			},
		},
	})
	.then((instance) => {
		wasm = instance

		const message = 'Hello World'
		const ptrMessageToEncore = wasm.__retain(wasm.__allocString(message))

		console.log(instance.main(ptrMessageToEncore))
	})
	.catch(console.error)
