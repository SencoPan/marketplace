<template lang="pug">
	v-main.my-6
		v-row.my-12: v-col.col-3: v-form(ref="form" v-model="validation"): v-card.py-8
			v-row: v-col.col-8: h1.text-h6 Вход
			v-row(v-for="(field, index) in form" :key="index")
				v-col.col-8.my-0.py-0(): v-text-field(
					v-model="field.value"
					:rules="minRule"
					dense
					:label="field.text"
					outlined :type="field.type"
				)
			v-row
				v-col.col-8: v-btn(depressed color="primary" @click="proceed" tile).d-flex.button-fill Войти

</template>

<script>
import {request, setToken} from '../utils/auth';

export default {
	name   : 'Login',
	data   : function () {
		return {
			form      : {
				login   : {
					value: '',
					type : 'text',
					text : 'Логин'
				},
				password: {
					value: '',
					type : 'password',
					text : 'Пароль'
				},
			},
			minRule   : [v => !!v || 'Обязательно поле'],
			validation: false
		};
	},
	methods: {
		async proceed() {
			this.$refs.form.validate();
			if (!this.validation) return;

			const result = await request({
				method: 'post',
				data  : this.getFormData(),
				url   : '/user/login'
			});

			if (!result || !result.data.token) return;

			setToken(result.data.token);
			window.location.href = '/';
		},
		getFormData() {
			const payload = {};
			for (let [k, v] of Object.entries(this.form)) payload[k] = v.value;
			return payload;
		}
	},
	created() {
	}
};
</script>

<style scoped>
.row {
	display         : flex;
	justify-content : center;
}

.button-fill {
	width : 100%;
}
</style>
