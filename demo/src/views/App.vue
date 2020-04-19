<template>
	<div id="app">
		<Title />
		<Generator />
		<Usage />
		<About />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Title from '../components/Title/Title.vue';
import Generator from '../components/Generator/Generator.vue';
import Usage from '../components/Usage/Usage.vue';
import About from '../components/About/About.vue';

@Component({
	name: 'app',
	components: { Title, Generator, Usage, About },
})
export default class App extends Vue {
	mounted() {
		// Setup analytics
	}
}
</script>
