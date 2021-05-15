<template lang="pug">
	v-app-bar(color="primary" tile): v-row.d-flex.justify-space-between.px-4( )
		v-toolbar-title().white--text {{currentRouteName}} {{states[indexForText]}}

		div: v-btn(v-for='(type, index) in types' :key='index' depressed  @click="redirectLogout(type)" tile outlined).white--text.mx-4 {{actions[type]}}
</template>

<script>
import axios from 'axios'
import {authed} from '@/app/utils/auth';

export default {
	name    : 'Nav',
	data() {
		return {
			authed : false,
			types  : [],
			actions: ['Создать аккаунт', 'Войти', 'Выйти', 'На главную', 'Выйти со всех аккаунтов'],
			states : ['Авторизация', 'Регистрация', 'Магазин']
		};
	},
	computed: {
		currentRouteName() {
			this.watchType();
		},
		indexForText() {
			if (this.authed) return 2;
			return this.types[0];
		}
	},
	methods : {
		async redirectLogout(type) {
			if (type === 0) return this.$router.push('/reg');
			if (type === 1) return this.$router.push('Login');
			if (type === 3) return this.$router.push('/');
			if (type === 2 || type === 4) {
				await axios({
					method: 'post',
					url   : `/user/${type === 2 ? 'logout' : 'logoutAll'}`
				});
				localStorage.clear();
				window.location.href = '/';
			}
		},
		watchType() {
			this.types = this.authed ? [2, 4] : this.$route.name === 'Login' ? [0, 3] : this.$route.name === 'Registration' ? [1, 3] : [0, 1];
		}
	},
	mounted() {
		this.authed = authed();
	}
};
</script>

<style scoped>

</style>
