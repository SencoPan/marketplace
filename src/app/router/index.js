import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

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
	let authedCheck;
	const token = localStorage.getItem('userToken')
	try {
		authedCheck = token ? await axios.get(`/user/verifyJWT?token=${token}`) : false;
	} catch (e) {
		authedCheck = false;
	}

	authedCheck = authedCheck ? authedCheck.data.verified : false;

	if ((to.name === 'Merchant') && !authedCheck) {
		next({name: 'Login'});
	} else if (~['Login', 'Registration'].indexOf(to.name) && authedCheck) {
		next({name: '/'});
	} else {
		next();
	}
});

export default router;
