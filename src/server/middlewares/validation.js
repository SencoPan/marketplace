module.exports = (schema) => {
	return (req, res, next) => {
		if (!schema) return next();
		schema.validate(req.body) ? next() : res.send(400);
	};
};
