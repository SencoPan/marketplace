const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productScheme = new Schema({
	productId  : {type: String, required: true},
	name       : {type: String, required: true},
	code       : {type: String, required: true},
	price      : {type: String, required: true},
	description: {type: String, required: true},
	userId     : {
		type    : String,
		required: true,
		ref     : 'UserSchema'
	}
}, {
	timestamps: true
});

productScheme.index({productId: 1, code: 1}, {unique: true});

module.exports = mongoose.model('Product', productScheme);


