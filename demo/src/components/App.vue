<template>
	<div id="app">
		<Generator />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Generator from './Generator.vue';

@Component({
	name: 'app',
	components: { Generator },
})
export default class App extends Vue {
	mounted() {
		// Setup analytics
	}
}
</script>
