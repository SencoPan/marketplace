<template lang="pug">
	v-app
		v-card(tile).overflow-hidden: Nav

		router-view


</template>

<script>
import Nav from '@/app/components/Nav';

const axios = require('axios');

export default {
	name      : 'Market',
	components: {Nav},
	methods   : {},
	async mounted() {
	},
	async created() {
	}
};
</script>

<style>

</style>
