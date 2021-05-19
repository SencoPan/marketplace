const User = require('../models/user');
const querystring = require('querystring');

exports.login = async function (request, response) {
	try {
		const {login, password} = request.body;
		const user = await User.findOne({login});
		if (!user || !user.checkPassword(password)) return response.status(400).end();

		const token = await user.generateAuthToken(User);

		response.status(200).send({user, token});
	} catch (e) {
		console.error(e);
		response.status(400).end();
	}
};

exports.registration = async function (request, response) {
	try {
		const user = await User.create(request.body);
		const token = await user.generateAuthToken(User);
		response.status(201).send({user, token});
	} catch (error) {
		console.error(error);
		response.status(400).end();
	}
};


exports.logout = async (req, res) => {
	// Log user out of the application
	try {
		await User.updateOne({_id: req.user._id}, {$pull: {tokens: {token: req.token}}});
		res.status(200).end();
	} catch (error) {
		console.error(error);
		res.status(500).end();
	}
};

exports.logoutAll = async (req, res) => {
	// Log user out of all devices
	try {
		await User.updateOne({_id: req.user._id}, {tokens: []});
		res.status(200).end();
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
};

exports.verifyJWT = async function (request, response) {
	try {
		response.status(201).send({verified: true, user: request.user});
	} catch (error) {
		console.error(error);
		response.status(400).end();
	}
};
