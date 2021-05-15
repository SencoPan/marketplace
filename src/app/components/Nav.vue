<template lang="pug">
	v-app-bar(color="primary" tile): v-row.d-flex.justify-space-between.px-4( )
		v-toolbar-title().white--text {{states[type]}} {{currentRouteName}}
		//v-btn(depressed color="primary" ) {{actions[type]}}

		v-btn(depressed  @click="redirectLogout" tile outlined).white--text {{actions[type]}}
</template>

<script>

import {authed} from '@/app/utils/auth';

export default {
	name    : 'NavButtons',
	data() {
		return {
			authed : false,
			type   : false,
			actions: ['Создать аккаунт', 'Войти', 'Выйти'],
			states : ['Авторизация', 'Регистрация', 'Магазин']
		};
	},
	computed: {
		currentRouteName() {
			this.type = this.authed ? 2 : this.$route.name === 'Login' ? 0 : this.$route.name === 'Registration' ? 1 : 3;
		}
	},
	methods : {
		redirectLogout() {

		}
	},
	mounted() {
		this.authed = authed();
	}
};
</script>

<style scoped>

</style>
