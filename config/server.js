module.exports = {
	port: 3000,
	JWT : {
		key: 'secret'
	},
	db  : {
		mongodb: {
			url       : 'mongodb://localhost:27017/',
			collection: 'market'
		}
	}
};
