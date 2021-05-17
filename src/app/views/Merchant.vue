<template lang="pug">
	v-main.main-block
		v-row.pt-8: v-col.col-6.py-0: p.text-h5.mb-0 Товар
		ProductForm(@create-product="createMerch")

</template>

<script>
import axios from 'axios';
import ProductForm from '@/app/components/ProductForm';

export default {
	name      : 'Merchant',
	components: {ProductForm},
	methods   : {
		async createMerch(form) {
			const formData = new FormData();
			for (let i in form) formData.append(i, form[i].value);

			const result = await axios({
				method : 'POST',
				url    : '/merchant/create',
				data   : formData,
				headers: {
					Accept        : 'application/json',
					'Content-Type': 'multipart/form-data',
				},

			});

			if (!result && !result.data) return false; //add snackbar
			return true;
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
