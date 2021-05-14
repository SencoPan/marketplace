const User = require('../models/user');

exports.login = async function (request, response) {

};

exports.registration = function (request, response) {
	if (!request.body) return response.sendStatus(400);

};
