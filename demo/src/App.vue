<template>
	<div id="app">
		todo
	</div>
</template>

<script>
import loader from '@assemblyscript/loader'

export default {
	name: 'app',
	mounted: () => {
		let wasm = null

		const memory = new WebAssembly.Memory({ initial: 1 })

		const t0 = performance.now()
		loader
			.instantiateStreaming(fetch('./main.wasm'), {
				// Should only be functions
				config: {
					DEBUG: () => 1, // 0 == false, 1 == true
				},
				env: {
					trace: (msg) => {
						console.log('[TRACE] : ' + wasm.__getString(msg))
					},
					memory,
				},
			})
			.then((instance) => {
				wasm = instance

				const message = 'HELLO WORLD'
				const ptrMessageToEncore = wasm.__retain(wasm.__allocString(message))

				instance.main(ptrMessageToEncore, 2)

				const mem = new Int32Array(memory.buffer) // matrix

				const t1 = performance.now()

				console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')
			})
			.catch(console.error)
	},
	data() {
		return {}
	},
	methods: {},
}
</script>
