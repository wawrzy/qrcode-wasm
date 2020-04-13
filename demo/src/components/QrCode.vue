<template>
	<div class="root">
		<div>Size = {{ size }}</div>
		<div v-for="(line, index) in qrCodeData" v-bind:key="index" class="line">
			<div
				v-for="(module, indexModule) in line"
				v-bind:key="indexModule"
				v-bind:class="{
					black: module === 1,
					white: module === 0,
					module: true,
				}"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import './QrCode.scss';

const Props = Vue.extend({
	props: {
		matrix: { type: Int32Array, default: () => [] },
	},
});

@Component
export default class QrCode extends Props {
	matrix: Int32Array;

	mounted() {
		console.log(this.qrCodeData);
		console.log(this.size);
	}

	get qrCodeData(): Array<number[]> {
		const data = this.matrix.slice(1);
		const res = [];

		for (let i = 0; i < this.size; i++) {
			res.push(
				this.matrix.slice(i * this.size + 1, i * this.size + 1 + this.size)
			);
		}

		return res;
	}

	get size(): number {
		return this.matrix[0];
	}
}
</script>
