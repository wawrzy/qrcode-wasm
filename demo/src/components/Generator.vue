<template>
	<div>
		<button v-on:click="generate">Generate</button>
		<QrCode
			v-if="matrix"
			v-bind:matrix="matrix.slice(0, matrix[0] * matrix[0] + 1)"
		/>
	</div>
</template>

<script lang="ts">
import * as loader from '@assemblyscript/loader';
import Vue from 'vue';
import Component from 'vue-class-component';

import QrCode from './QrCode.vue';

@Component({
	components: { QrCode },
})
export default class Generator extends Vue {
	matrix: Int32Array = null;

	mounted() {}

	generate() {
		let wasm = null;
		const memory = new WebAssembly.Memory({ initial: 1 });
		const t0 = performance.now();
		loader
			.instantiateStreaming(fetch('./main.wasm'), {
				// Should only be functions
				config: {
					DEBUG: () => 1, // 0 == false, 1 == true
				},
				env: {
					trace: (msg) => {
						console.log('[TRACE] : ' + wasm.__getString(msg));
					},
					memory,
				},
			})
			.then((instance) => {
				wasm = instance;
				const message = 'Hello jérôme';
				const ptrMessageToEncore = (wasm.__retain as Function)(
					wasm.__allocString(message)
				);
				(instance as any).main(ptrMessageToEncore, 3);

				this.matrix = new Int32Array(memory.buffer); // matrix

				const t1 = performance.now();
				console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.');
			})
			.catch(console.error);
	}
}
</script>
