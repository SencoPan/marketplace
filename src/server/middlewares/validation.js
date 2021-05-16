module.exports = (schema) => {
	return (req, res, next) => {
		if (!schema) return next();
		const result = schema.validate(req.body);

		if (!result.error) {
			next();
		} else {
			console.error(result.error.details);
			res.status(400).end();
		}
	};
};
