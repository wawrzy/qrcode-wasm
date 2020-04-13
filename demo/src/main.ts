import Vue from 'vue'
import App from './components/App.vue'

Vue.config.productionTip = false

new Vue({
	render: (h) => h(App),
}).$mount('#app')

// docs
// https://class-component.vuejs.org/guide/property-type-declaration.html
// https://vuejs.org/v2/guide/typescript.html
// https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/components/App.vue
// https://github.com/microsoft/TypeScript-Vue-Starter/blob/master/tsconfig.json
