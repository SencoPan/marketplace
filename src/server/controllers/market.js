const Product = require('../models/product');
const mongoose = require('mongoose');

exports.list = async function (request, response) {
	try {
		let {id, page, sort, perPage, priceLT, priceGT, nameSearch} = request.query;

		const numbers = {page, perPage, priceLT, priceGT, sort};
		for (let index in numbers) numbers[index] = parseInt(numbers[index]) || undefined;

		const isThere = (val) => val !== 0 ? val : undefined;

		let flag = false;
		let query = {};
		let sortOpts;

		id ? query.userId = mongoose.Types.ObjectId(id) : '';
		numbers.sort ? sortOpts = {createdAt: isThere(numbers.sort)} : '';

		numbers.priceLT ? query.price = {'$lt': numbers.priceLT,} : flag = true;
		numbers.priceGT ? !flag ? query.price['$gt'] = numbers.priceGT : query.price = {'$gt': numbers.priceGT} : '';

		nameSearch ? query.name = {'$regex': nameSearch, '$options': 'i'} : '';

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

exports.image = async function (request, response) {
	try {
		const {id} = request.query;
		const product = Product.findOne({_id: id}, {image: 1, _id: 0});

		response.status(200).send(product.image);
	} catch (e) {
		response.status(400).end();
	}
};

exports.update = async function (request, response) {
	try {
		const {userId, _id, name, price, description} = request.body;

		const isThereImage = request.files.length;
		const image = isThereImage ? {
			data       : request.files[0].buffer,
			contentType: request.files[0].mimetype
		} : '';

		const updateBlock = {
			name, price, description
		};

		isThereImage ? updateBlock.image = image : '';

		if (request.user._id != userId) return response.status(400).end(); //Controller not for admins

		const result = await Product.updateOne({_id, userId}, {$set: updateBlock});
		const payload = {status: result.ok};

		isThereImage ? payload.imageBase64 = request.files[0].buffer.toString('base64') : '';

		response.status(200).send(payload);
	} catch (e) {
		console.log(e);
		response.status(400).end();
	}
};
exports.deleteProduct = async function (request, response) {
	try {
		const {userId, _id} = request.body;
		if (request.user._id != userId) return response.status(400).end(); //Controller not for admins

		await Product.deleteOne({userId, _id});

		response.status(200).end();
	} catch (e) {
		console.log(e);
		response.status(400).end();
	}
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
