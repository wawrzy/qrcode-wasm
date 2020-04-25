<template>
	<div>
		<div class="usage-title">Basic Usage</div>
		<Prism language="js" class="prism">{{ code }}</Prism>
	</div>
</template>

<script lang="ts">
// import * as loader from '@assemblyscript/loader';
import Vue from 'vue';
import Component from 'vue-class-component';

import 'prismjs';
import 'prismjs/components/prism-scss.min';
import 'prismjs/plugins/autolinker/prism-autolinker.min';
import Prism from 'vue-prism-component';

import './style.scss';

@Component({
	components: { Prism },
})
export default class Usage extends Vue {
	code: string = `
    import { QrCodeWasm } from 'qrcode-wasm';

    const generator = new QrCodeWasm({ debug: true });

    await generator.encode('HELLO WORLD').then((buffer) => {
      // buffer = Int32Array
      // [Side size of Matrix (total size = Side Size * Side Size), 1, 0, 1, 0, 0 ....]
      // 1 = Dark Module
      // 0 = White Module
    });

    const dataURL = await generator.png(200 /* PNG size in Pixel */);
  `;
}
</script>
