<template lang="pug">
	.main
		v-form(v-model="valid" ref="form")#merchForm.pt-8: v-row(v-for="(field, index) in form" :key="index"): v-col.col-6.py-0
			v-text-field(v-if='field.code !== 2' :label="field.label" v-model="field.value" v-mask="`${field.code === 1 ? '############' : ''}`"  :type="field.code === 1 ? 'tel' : 'text'" :rules="field.rule" outlined dense)
			v-file-input(v-else :label="field.label" v-model="field.value" dense outlined accept="image/png, image/jpeg, image/bmp" :rules="field.rule")
		v-row(v-if="!redact"): v-col.col-6.py-0.d-flex.justify-center: v-btn(large outlined depressed color="success" @click="createProduct" ) Создать
		v-row(v-else).my-2
			v-col.col-6.py-0.d-flex.justify-end
				v-btn(@click="cancelRedact" outlined  small) Отменить
				v-btn(@click="completeRedact" color='primary' small) Применить
</template>

<script>
const createField = (label, code, value = '', rule = [v => !!v || 'Обязательное поле']) => {
	return {value, label, code, rule};
};

export default {
	name   : 'ProductForm',
	props  : {
		redact    : Boolean,
		redactItem: Object
	},
	data() {
		return {
			valid: false,
			form : {
				'name'       : createField('Наименование', 0),
				'price'      : createField('Цена', 1),
				'description': createField('Описание', 0),
				'image'      : createField('Изображение', 2, [], [value => (this.redact ? !value || !value.length : false) || value.size < 2000000 || 'Изображение должен быть меньше 2мб'])
			}
		};
	},
	watch  : {
		redactItem() {
			if (this.redact) for (let val of ['name', 'price', 'description']) this.form[val].value = this.redactItem[val];
			this.form.image.rule = [value => (this.redact ? !value || !value.length : false) || value.size < 2000000 || 'Изображение должен быть меньше 2мб'];
		}
	},
	methods: {
		async completeRedact() {
			this.$refs.form.validate();
			console.log('re');
			if (!this.valid) return;
			console.log('qwe');
			this.$emit('complete-redact', this.form);
		},

		async cancelRedact() {
			this.$emit('cancel-redact');
		},

		async createProduct() {

			this.form.price.value = parseInt(this.form.price.value) || '';

			this.$refs.form.validate();
			if (!this.valid) return;

			const result = await this.$emit('create-product', this.form);
			result ? this.$refs.form.reset() : '';
		}
	},
	mounted() {
		if (this.redact) for (let val of ['name', 'price', 'description']) this.form[val].value = this.redactItem[val];
		this.form.image.rule = [value => !value || !value.length || value && value.size < 2000000 || 'Изображение должен быть меньше 2мб'];
	}
};
</script>

<style scoped>
.row {
	display         : flex;
	justify-content : center;
}
</style>
