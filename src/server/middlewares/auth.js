const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {JWT} = require('../../../config/server');

const getData = async (req) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		console.log('UM', token);
		const data = token !== null && !!token ? jwt.verify(token, JWT.key) : false;
		return {data, token};
	} catch (e) {
		console.log(e);
		return {data: null, token: null};
	}
};

const authCheck = async (req, res, next) => {
	try {
		const {data, token} = getData(req);
		if (!token) {
			req.authed = false;
			return next();
		}

		const user = await User.findOne({_id: data._id, 'tokens.token': token});
		if (!user) return req.authed = false;

		req.authed = true;
		next();
	} catch (error) {
		req.authed = false;
	}
};

const authControl = async (req, res, next) => {
	const {data, token} = await getData(req);
	const throwStatus = () => res.status(401).send({error: 'Not authorized to access this resource'});
	if (!token) return throwStatus();

	try {
		const user = await User.findOne({_id: data._id, 'tokens.token': token});
		if (!user) return res.status(404).send({error: 'User not found'});

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		throwStatus();
	}
};
module.exports = {authControl, authCheck};
