const mongoose = require('mongoose');
const {db} = require('../../../config/server');

// подключение
const connectedMongoose = async () => {
	if (mongoose.connection.readyState === 1) return mongoose;
	return await mongoose.connect(`${db.mongodb.url}/${db.mongodb.collection}`, {useUnifiedTopology: true, useNewUrlParser: true});
};

module.exoports = connectedMongoose;
