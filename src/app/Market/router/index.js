import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path    : '*',
		name    : 'Market',
		redirect: '/'
	}];

const router = new VueRouter({
	mode: 'history',
	routes,
	/*
	 scrollBehavior(to, from, savedPosition) {
	 }
	 */
});

export default router;
