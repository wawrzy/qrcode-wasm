<template>
	<div class="generator">
		<form class="form">
			<input class="form__field" v-model="message" placeholder="Your message" />
			<button
				type="button"
				v-on:click="generate"
				class="btn btn--primary btn--inside uppercase"
			>
				Generate
			</button>
		</form>
		<QrCode
			v-if="matrix"
			v-bind:matrix="matrix.slice(0, matrix[0] * matrix[0] + 1)"
		/>
		<button type="button" v-on:click="png" class="btn btn--primary uppercase">
			Download png
		</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { QrCodeWasm } from 'qrcode-wasm';
import QrCode from '../QrCode/QrCode.vue';

import './style.scss';

declare var ENV: string;

@Component({
	components: { QrCode },
})
export default class Generator extends Vue {
	matrix: Int32Array = null;
	generator: QrCodeWasm = null;
	message: string = '';

	mounted() {
		this.generator = new QrCodeWasm({
			debug: true,
			wasmPath: ENV === 'PRODUCTION' ? 'demo/dist/main.wasm' : 'main.wasm',
		});

		this.generator.encode('HELLO WORLD').then((buffer) => {
			this.matrix = buffer as Int32Array;
		});
	}

	generate() {
		this.generator.encode(this.message).then((buffer) => {
			this.matrix = buffer as Int32Array;
		});
	}

	async png() {
		const dataUrl = await this.generator.png(200);

		const link = document.createElement('a');
		link.download = 'qr-code.png';
		link.href = dataUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
</script>
