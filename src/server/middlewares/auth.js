const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {JWT} = require('../../../config/server');

const getData = (req) => {
	const token = req.header('Authorization').replace('Bearer ', '');
	const data = jwt.verify(token, JWT.key);
	return {data, token};
};

const authCheck = async (req, res, next) => {
	const {data, token} = getData(req);

	try {
		const user = await User.findOne({_id: data._id, 'tokens.token': token});
		if (!user) return req.authed = false;

		req.authed = true;
		next();
	} catch (error) {
		req.authed = false;
	}
};

const authControl = async (req, res, next) => {
	const {data, token} = getData(req);

	try {
		const user = await User.findOne({_id: data._id, 'tokens.token': token});
		if (!user) return res.status(404).send({error: 'User not found'});

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		res.status(401).send({error: 'Not authorized to access this resource'});
	}
};
module.exports = {authControl, authCheck};
