<template lang="pug">
	v-app-bar(color="primary" tile): v-row.d-flex.justify-space-between.px-4( )
		v-toolbar-title().white--text {{currentRouteName}} {{states[indexForText]}}

		div: v-btn(v-for='(type, index) in types' :key='index' depressed  @click="redirectLogout(type)" tile outlined).white--text.mx-4 {{actions[type]}}
</template>

<script>
import axios from 'axios';
import {authed} from '@/app/utils/auth';

export default {
	name    : 'Nav',
	data() {
		return {
			authed  : false,
			types   : [],
			redirect: {0: '/reg', 1: 'Login', 3: '/merch', 5: '/'},
			actions : ['Создать аккаунт', 'Войти', 'Выйти', 'Добавить товар', 'Выйти со всех аккаунтов', 'На главную'],
			states  : ['Авторизация', 'Регистрация', 'Магазин', 'Добавление товара']
		};
	},
	computed: {
		currentRouteName() {
			this.watchType();
		},
		indexForText() {
			if (this.authed && this.$route.name !== 'Merchant' || this.$route.name === 'Market') {
				return 2;
			} else if (this.authed) return 3;
			return this.types[0];
		}
	},
	methods : {
		async redirectLogout(type) {
			if (type === 2 || type === 4) {
				await axios({
					method: 'post',
					url   : `/user/${type === 2 ? 'logout' : 'logoutAll'}`
				});
				localStorage.clear();
				return window.location.href = '/';
			}
			await this.$router.push(this.redirect[type]);
		},
		watchType() {
			const assign = (arr) => this.types = arr;

			if (this.authed && this.$route.name !== 'Merchant') {
				assign([2, 4, 3]);
			} else if (this.authed) {
				assign([2, 4, 5]);
			} else if (this.$route.name === 'Login') {
				assign([0, 5]);
			} else if (this.$route.name === 'Registration') {
				assign([1, 5]);
			} else {
				assign([0, 1]);
			}
		}
	},
	mounted() {
		this.authed = authed();
	}
};
</script>

<style scoped>

</style>
