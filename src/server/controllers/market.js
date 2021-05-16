const Product = require('../models/product');

exports.list = async function (request, response) {
	try {
		let {
			page,
			sort,
			perPage,
			priceLT,
			priceGT,
			nameSearch
		} = request.query;

		const numbers = {page, perPage, priceLT, priceGT, sort};
		for (let index in numbers) numbers[index] = parseInt(numbers[index]) || undefined;

		const isThere = (val) => val !== 0 ? val : undefined;

		let query = {};
		let sortOpts;
		numbers.sort ? sortOpts = {createdAt: isThere(numbers.sort)} : '';
		numbers.priceLT || numbers.priceGT ? query.price = {
			'$lt': isThere(numbers.priceLT),
			'$gt': isThere(numbers.priceGT)
		} : undefined;
		nameSearch ? query.name = {'$regex': nameSearch, '$options': 'i'} : '';

		console.log(query);

		const total = await Product.find(query).countDocuments();
		const products = await Product.find(query)
		                              .sort(sortOpts)
		                              .skip((numbers.page - 1) * numbers.perPage)
		                              .limit(numbers.perPage);
		products.map((product, index) => {
			products[index] = {product, imageBase64: product.image.data.toString('base64')};
		});
		response.status(200).send({products, total});
	} catch (e) {
		console.error(e);
		response.status(500).end();
	}
};

exports.filteredList = async function (request, response) {

};

exports.create = async function (request, response) {
	try {
		const product = new Product();
		const productBody = {
			...request.body,
			image : {
				data       : request.files[0].buffer,
				contentType: request.files[0].mimetype
			},
			userId: request.user._id,
			code  : await product.generateCode(Product)
		};

		if (!productBody.code) return response.status(400).end(); //change product code to characters instead of numbers

		for (let index in productBody) product[index] = productBody[index];

		await product.save();
		response.status(200).send({created: true});
	} catch (e) {
		console.error(e);
		response.status(400).end();
	}
};
