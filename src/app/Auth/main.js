import Vue from 'vue';
import App from './Auth';
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

new Vue({
	vuetify,
	el    : '#app',
	render: h => h(App)
});

