import Vue from 'vue';
import App from './Main.vue';
import Vuetify from 'vuetify';
import router from 'router';

Vue.use(Vuetify);

const vuetify = new Vuetify({});

new Vue({
	vuetify,
	router,
	el    : '#app',
	render: h => h(App)
});

