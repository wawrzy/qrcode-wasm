<template>
	<div class="title-container">
		<div class="finder-pattern left">
			<div class="center" />
		</div>
		QRCODE WASM
		<div class="finder-pattern right">
			<div class="center" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';

@Component
export default class Title extends Vue {}
</script>
