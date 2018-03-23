import Vue from 'vue'
import vuejsStorage from 'vuejs-storage'
import VueAsyncComputed from 'vue-async-computed'

import App from '@/App'

Vue.use(vuejsStorage)
Vue.use(VueAsyncComputed)

new Vue({
	el: '#app',
	render: h => h(App)
})
