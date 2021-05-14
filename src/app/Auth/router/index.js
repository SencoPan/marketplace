import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path     : '/reg',
		name     : 'Registration',
		component: () => import(/* webpackChunkName:'registration' */ '../views/Registration.vue')
	},
	{
		path     : '/login',
		name     : 'Login',
		component: () => import(/* webpackChunkName:'login' */ '../views/Login.vue')
	},
	{
		path    : '*',
		name    : 'Auth',
		redirect: '/login'
	}
];

const router = new VueRouter({
	mode: 'history',
	routes,
	/*
	 scrollBehavior(to, from, savedPosition) {
	 }
	 */
});

export default router;
