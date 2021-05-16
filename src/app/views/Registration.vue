<template lang="pug">
	v-main.my-6
		v-row.my-12: v-col.col-3: v-form(ref="form" v-model="validation"): v-card.pt-8
			v-row: v-col.col-8: h1.text-h6 Создание аккаунта
			v-row(v-for="(field, index) in form" :key="index")
				v-col.col-8.my-0.py-0(): v-text-field(
					v-model="field.value"
					:rules="field.rule"
					dense
					:label="field.text"
					outlined :type="field.type"
				)
			v-row
				v-col.col-8.pb-8: v-btn(depressed color="primary" @click="proceed" tile).d-flex.button-fill Зарегистрироваться

</template>

<script>
import {request, setToken} from '@/app/utils/auth';
//@todo Поместить повторяющий код в mixin
export default {
	name   : 'Registration',
	data   : function () {
		return {
			form      : {
				login        : {
					value: '',
					text : 'Логин',
					type : 'text',
					rule : [v => !!v || 'Обязательное поле', v => v && v.length > 3 || 'Логин должен состоять из 4 или более символов']
				},
				password     : {
					value: '',
					type : 'password',
					text : 'Пароль',
					rule : [v => !!v || 'Обязательное поле', v => v && v.length > 5 || 'Пароль должен состоять из 6 или более символов']
				},
				passwordCheck: {
					value: '',
					type : 'password',
					text : 'Пароль ещё раз',
					rule : [v => !!v || 'Обязательное поле', v => v && v === this.form.password.value || 'Пароль не совпадает']
				},
			},
			validation: false
		};
	},
	methods: {
		async proceed() {
			this.$refs.form.validate();
			if (!this.validation) return;
			const {login, password} = this.getFormData();

			const result = await request({
				method: 'post',
				data  : {login, password},
				url   : '/user/reg'
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
