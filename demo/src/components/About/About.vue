<template>
	<div class="about-container">
		<div class="about-title">Build With</div>
		<div class="logos">
			<a href="https://docs.assemblyscript.org" target="_blank">
				<img
					class="logo"
					src="https://avatars0.githubusercontent.com/u/28916798?s=280&v=4"
				/>
			</a>
			<a href="https://www.typescriptlang.org/" target="_blank">
				<img
					class="logo"
					src="https://cdn.worldvectorlogo.com/logos/typescript.svg"
				/>
			</a>
		</div>
		<div class="signature">
			<span class="fa fa-fw fa-code" />
			&nbsp;with&nbsp;
			<span class="fa fa-fw fa-heart" />
			&nbsp;by Julien Wawrzyniak
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';

@Component
export default class About extends Vue {}
</script>
