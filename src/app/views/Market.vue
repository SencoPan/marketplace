<template lang="pug">
	v-main.pa-0.right-padding
		v-row.d-flex.flex-column.mt-4
			v-col.col-12.d-flex: p.mb-0.text-h6 Параметры отображения

		v-form(ref="form" v-model="valid"): v-row.d-flex.flex-wrap
			v-col.col-3: v-text-field(v-model="form.nameSearch" dense outlined label="Поиск по имени")
			v-col.col-3: v-select(v-model='form.sort' :items="sortTypes" item-text='text' item-value='value' dense outlined label="Сортировка по дате создания" )
			v-col(v-for="(field, index) in numberIndex" :key='index' :class="field.type === 1 ? 'col-2' : 'col-1'"): v-text-field(v-mask="`#######`" dense outlined  v-model="form[field.name]" validate-on-blur :label="field.label" :rules="field.rule")
			v-col.col-2: v-btn(@click="refreshList" color="primary" outlined) Применить

		v-row.d-flex.flex-column
			v-col.col-12.d-flex: p.mb-0.text-h6 Подходящие товары

		v-row(v-if="!loading").d-flex.flex-wrap: v-card(v-for="(productData, index) in products" :key="index").px-4.ma-6
			v-card-title {{productData.product.name}}
			v-card-text
				img(:src="`data:${productData.product.image.contentType};base64,${productData.imageBase64}`").constrain
				p.mb-0.text-body-1 {{productData.product.description}}
				.d-flex.justify-end: p.mb-0.text-caption {{productData.product.price}} руб.

		v-row(v-else).d-flex.justify-center.my-10: v-progress-circular(indeterminate color="primary" )

		v-pagination(
			v-model="current"
			:length="pages"
			@input="newPage"
			:total-visible="7"
		)
</template>

<script>
import axios from 'axios';

const generateDefaultParams = (page) => {
	return {
		page      : page,
		sort      : 0,
		perPage   : 10,
		priceLT   : false,
		priceGT   : false,
		nameSearch: ''
	};
};

export default {
	name   : 'Market',
	data() {
		return {
			products   : [],
			total      : 0,
			pages      : 1,
			current    : 1,
			valid      : true,
			loading    : true,
			sortTypes  : [
				{
					text : 'По возрастанию',
					value: 1
				},
				{
					text : 'По убыванию',
					value: -1
				},
			],
			form       : generateDefaultParams(this.current),
			numberIndex: [
				{
					name: 'perPage', label: 'Товаров за страницу', type: 1
				},
				{
					name: 'priceGT', label: 'Цена с',
					rule: [v => !v || !this.form.priceLT || v < this.form.priceLT || 'Неверные параметры ("Цена с" больше "Цена до")']
				}, {
					name: 'priceLT', label: 'Цена до',
					rule: [v => !v || !this.form.priceGT || v > this.form.priceGT || 'Неверные параметры ("Цена до" меньше "Цена с")']
				},]
		};
	},
	methods: {

		generateCurrentParams(page = this.current) {
			return {
				page,
				sort      : this.form.sort,
				perPage   : this.form.perPage,
				priceLT   : this.form.priceLT,
				priceGT   : this.form.priceGT,
				nameSearch: this.form.nameSearch
			};
		},

		async refreshList() {
			this.$refs.form.validate();
			if (!this.valid) return false; // add snackbar

			const params = await this.generateCurrentParams(1);
			await this.updateList(params);

			this.current = 1;
		},

		async newPage() {
			const params = await this.generateCurrentParams();
			await this.updateList(params);
		},

		async updateList(params) {
			try {
				this.loading = true;

				const result = await axios({
					method: 'get',
					url   : '/merchant/list',
					params
				});

				if (!result.data) return;

				const {products, total} = result.data;

				this.products = products;
				this.total = total;

				this.pages = Math.ceil(this.total / this.form.perPage);
				this.loading = false;
			} catch (e) {
				return false;
			}
		}
	},
	async mounted() {
		await this.updateList(generateDefaultParams(this.current));
	}
};
</script>

<style scoped>
.right-padding {
	margin : 0 20%;
}

.constrain {
	max-height : 180px;
	max-width  : 320px;
}
</style>
