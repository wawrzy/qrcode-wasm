<template>
	<div id="app">
		Test
	</div>
</template>

<script>
import loader from '@assemblyscript/loader'

export default {
	name: 'app',
	components: {},
	mounted: () => {
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

				const message = 'HELLO WORLD'
				const ptrMessageToEncore = wasm.__retain(wasm.__allocString(message))

				console.log(instance.main(ptrMessageToEncore, 2))
			})
			.catch(console.error)
	},
	data() {
		return {}
	},
	methods: {},
}
</script>
