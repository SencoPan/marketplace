<template lang="pug">
	v-main.pa-0.right-padding
		v-dialog(v-model="dialog.display" width='500px')
			v-card
				v-card-title.d-flex.justify-center: p.mb-0 Редактирование товара {{dialog.redactValue.name}}
				v-card-text: ProductForm(:redact="true" :redact-item="dialog.redactValue" @cancel-redact="cancelRedact" @complete-redact="completeRedact")

		v-row.d-flex.flex-column.mt-4
			v-col.col-12.d-flex: p.mb-0.text-h6 Параметры отображения

		v-form(ref="form" v-model="valid"): v-row.d-flex.flex-wrap
			v-col.col-3.pb-0: v-text-field(v-model="form.nameSearch" dense outlined label="Поиск по имени")
			v-col.col-3.pb-0: v-select(v-model='form.sort' :items="sortTypes" item-text='text' item-value='value' dense outlined label="Сортировка по дате создания" )
			v-col(v-for="(field, index) in numberIndex" :key='index' :class="field.type === 1 ? 'col-2' : 'col-1'").pb-0: v-text-field(v-mask="`#######`" dense outlined  v-model="form[field.name]" validate-on-blur :label="field.label" :rules="field.rule")
			v-col.col-2.pb-0: v-btn(@click="refreshList" color="primary" outlined) Применить

		v-row(v-if="mode.user._id").d-flex.flex-column
			v-col.col-12.d-flex.pt-0: v-checkbox(v-model="mode.mine" @change='manage' label='Управлять своим товаром')

		v-row.d-flex.flex-column
			v-col.col-12.d-flex: p.mb-0.text-h6 Подходящие товары

		v-row(v-if="!loading" ).d-flex.flex-wrap: Product(v-for="(productData, index) in products" :key="index" :index='index' :productData="productData" :mine="mode.mine" @delete-record="deleteRecord" @redact-record="redactRecord")

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
import {verify} from '@/app/utils/auth';
import Product from '@/app/components/Product';
import ProductForm from '@/app/components/ProductForm';

// стоило бы добавить сессию для сохранения настроек
const generateDefaultParams = (page) => {
	return {
		page      : page,
		sort      : 0,
		perPage   : 5,
		priceLT   : false,
		priceGT   : false,
		nameSearch: ''
	};
};

export default {
	name      : 'Market',
	components: {ProductForm, Product},
	data() {
		return {
			dialog     : {
				display    : false,
				redactValue: {},
				redactIndex: null
			},
			products   : [],
			mode       : {
				mine: false,
				user: {}
			},
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
				{name: 'perPage', label: 'Товаров за страницу', type: 1},
				{
					name: 'priceGT', label: 'Цена с',
					rule: [v => !v || !this.form.priceLT || v < this.form.priceLT || 'Неверные параметры ("Цена с" больше "Цена до")']
				}, {
					name: 'priceLT', label: 'Цена до',
					rule: [v => !v || !this.form.priceGT || v > this.form.priceGT || 'Неверные параметры ("Цена до" меньше "Цена с")']
				}
			]
		};
	},
	methods   : {
		generateCurrentParams(page = this.current) {
			return {
				page,
				id        : this.mode.mine ? this.mode.user._id : undefined,
				sort      : this.form.sort,
				perPage   : this.form.perPage,
				priceLT   : this.form.priceLT,
				priceGT   : this.form.priceGT,
				nameSearch: this.form.nameSearch
			};
		},

		async deleteRecord(item, index) {
			console.log('test');
			const result = await axios({
				method: 'POST',
				url   : '/merchant/delete',
				data  : {
					_id   : item._id,
					userId: this.mode.user._id
				}
			});

			if (result.status !== 200) return;
			await this.refreshList();
		},
		assignDialogState(item, index, state) {
			this.dialog.redactIndex = index;
			this.dialog.redactValue = item;
			this.dialog.display = state;
		},
		redactRecord(item, index) {
			this.assignDialogState(item, index, true);
		},
		cancelRedact() {
			this.assignDialogState({}, null, false);
		},
		async completeRedact(form) {
			const formData = new FormData();
			for (let i in form) formData.append(i, form[i].value);

			formData.append('userId', this.mode.user._id);
			formData.append('_id', this.dialog.redactValue._id);

			const result = await axios({
				method : 'POST',
				url    : '/merchant/update',
				data   : formData,
				headers: {
					Accept        : 'application/json',
					'Content-Type': 'multipart/form-data',
				},

			});

			if (result.status !== 200) return false;

			for (let i in form) {
				if (i === 'image' && result.data.imageBase64) {
					this.products[this.dialog.redactIndex].imageBase64 = result.data.imageBase64;
				} else {
					this.products[this.dialog.redactIndex].product[i] = form[i].value;
				}
			}
			this.cancelRedact();
		},
		async fetchUser() {
			const userData = await verify();
			if (!userData) return;

			this.mode.user = userData.user;
		},

		async showOnlyMine() {
			await this.fetchUser();
			await this.refreshList();
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

		async manage() {
			await this.refreshList();
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
		await this.fetchUser();
		await this.updateList(generateDefaultParams(this.current));
	}
};
</script>

<style scoped>
.right-padding {
	margin : 0 20%;
}

</style>
