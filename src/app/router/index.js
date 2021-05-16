import Vue from 'vue';
import VueRouter from 'vue-router';
import {verify} from '@/app/utils/auth';

Vue.use(VueRouter);

const routes = [
	{
		path     : '/',
		name     : 'Market',
		component: () => import(/* webpackChunkName:'market' */ '../views/Market.vue')
	},
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
		path     : '/merch',
		name     : 'Merchant',
		component: () => import(/* webpackChunkName:'merchant' */ '../views/Merchant.vue')
	},
	{
		path    : '*',
		name    : 'Index',
		redirect: '/'
	}];

const router = new VueRouter({
	mode: 'history',
	routes,

});

router.beforeEach(async (to, from, next) => {
	let authedCheck = await verify();


	if ((to.name === 'Merchant') && !authedCheck) {
		next({name: 'Login'});
	} else if (~['Login', 'Registration'].indexOf(to.name) && authedCheck) {
		next({name: '/'});
	} else {
		next();
	}
});

export default router;
