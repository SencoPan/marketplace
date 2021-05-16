import Vue from 'vue';
import App from './Main.vue';
import Vuetify from 'vuetify';
import router from './router/';
import {fetchToken} from '@/app/utils/auth';
import VueMask from 'v-mask'

Vue.use(VueMask)
Vue.use(Vuetify);
fetchToken();
const vuetify = new Vuetify({});

new Vue({
	vuetify,
	router,
	el    : '#app',
	render: h => h(App)
});

