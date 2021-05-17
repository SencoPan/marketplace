const User = require('../models/user');
const querystring = require('querystring');

exports.login = async function (request, response) {
	try {
		const {login, password} = request.body;
		const user = await User.findOne({login});
		if (!user || !user.checkPassword(password)) return response.status(400).end();

		const token = await user.generateAuthToken();

		response.status(200).send({user, token});
	} catch (e) {
		console.log(e);
		response.status(400).end();
	}
};

exports.registration = async function (request, response) {
	try {
		const user = new User(request.body);
		await user.save();
		const token = await user.generateAuthToken();
		response.status(201).send({user, token});
	} catch (error) {
		console.log(error);
		response.status(400).end();
	}
};


exports.logout = async (req, res) => {
	// Log user out of the application
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
};

exports.logoutAll = async (req, res) => {
	// Log user out of all devices
	try {
		req.user.tokens.splice(0, req.user.tokens.length);
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
};

exports.verifyJWT = async function (request, response) {
	try {
		response.status(201).send({verified: true, user: request.user});
	} catch (error) {
		console.log(error);
		response.status(400).end();
	}
};
