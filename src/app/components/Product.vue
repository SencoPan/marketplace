<template lang="pug">
	.d-flex.flex-column
		div(v-if='mine').control.px-4.d-flex.justify-end
			v-btn(icon @click="deleteProduct" color='error' small): v-icon mdi-delete
			v-btn(icon @click="redactProduct" color='primary' small): v-icon mdi-pencil
		v-card().px-4.mx-6.mb-4
			v-card-title {{product.name}}
			v-card-text
				img(:src="`data:;base64,${imageBase64}`").constrain
				p.mb-0.text-body-1 {{product.description}}
				.d-flex.justify-end: p.mb-0.text-caption {{product.price}} руб.
</template>

<script>
export default {
	name   : 'Product',
	props  : {
		productData: Object,
		mine       : Boolean,
		index      : Number
	},
	data() {
		return {
			product    : {},
			imageBase64: '',
		};
	},
	methods: {
		deleteProduct() {
			this.$emit('delete-record', this.product);
		},
		redactProduct() {
			this.$emit('redact-record', this.product, this.index);
		}
	},
	mounted() {
		this.product = this.productData.product;
		this.imageBase64 = this.productData.imageBase64;
	}
};
</script>

<style scoped>
.constrain {
	max-height : 180px;
	max-width  : 320px;
}
</style>
