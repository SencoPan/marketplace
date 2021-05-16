const Product = require('../models/product');

exports.list = async function (request, response) {

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
