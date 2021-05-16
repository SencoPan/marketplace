<template lang="pug">
	v-main.main-block
		v-row.pt-8: v-col.col-6.py-0: p.text-h5.mb-0 Товар
		v-form(v-model="valid" ref="form")#merchForm.pt-8: v-row(v-for="(field, index) in form" :key="index"): v-col.col-6.py-0
			v-text-field(v-if='field.code !== 2' :label="field.label" v-model="field.value" v-mask="`${field.code === 1 ? '############' : ''}`"  :type="field.code === 1 ? 'tel' : 'text'" :rules="field.rule" outlined dense)
			v-file-input(v-else :label="field.label" v-model="field.value" dense outlined accept="image/png, image/jpeg, image/bmp" :rules="field.rule")
		v-row: v-col.col-6.py-0.d-flex.justify-center: v-btn(large outlined depressed color="success" @click="createMerch" ) Создать

</template>

<script>
import axios from 'axios';

const createField = (label, code, value = '', rule = [v => !!v || 'Обязательное поле']) => {
	return {value, label, code, rule};
};

export default {
	name   : 'Merchant',
	data() {
		return {
			valid: false,
			form : {
				'name'       : createField('Наименование', 0),
				'price'      : createField('Цена', 1),
				'description': createField('Описание', 0),
				'image'      : createField('Наименование', 2, [], [
					value => !value || value.size < 2000000 || 'Изображение должен быть меньше 2мб',
				])
			}
		};
	},
	methods: {
		async createMerch() {
			this.form.price.value = parseInt(this.form.price.value) || '';

			this.$refs.form.validate();
			if (!this.valid) return;


			const formData = new FormData();
			for (let i in this.form) formData.append(i, this.form[i].value);

			const result = await axios({
				method : 'POST',
				url    : '/merchant/create',
				data   : formData,
				headers: {
					Accept        : 'application/json',
					'Content-Type': 'multipart/form-data',
				},

			});

			if (!result && !result.data) return; //add snackbar

			this.$refs.form.reset();
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
</style>
