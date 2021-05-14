const Product = require('../models/product');

exports.list = async function (request, response) {

};

exports.filteredList = async function (request, response) {

};

exports.create = function (request, response) {
	if (!request.body) return response.sendStatus(400);

};
