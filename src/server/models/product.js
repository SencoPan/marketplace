const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productScheme = new Schema({
	name       : {type: String, required: true},
	code       : {type: String, required: true},
	price      : {type: String, required: true},
	description: {type: String, required: true},
	image      :
		{
			data       : Buffer,
			contentType: String
		},
	userId     : {
		type    : String,
		required: true,
		ref     : 'UserSchema'
	}
}, {
	timestamps: true
});


productScheme.index({code: 1}, {unique: true});


productScheme.methods.generateCode = async function (Product) {
	const lastRecord = await Product.find({}, {code: 1, _id: 0}).sort({_id: -1}).limit(1);
	if (!lastRecord || !lastRecord.length) return '000001';

	let lastCode = lastRecord[0].code;
	let code = ((parseInt(lastCode) || 0) + 1).toString();

	if (code.length > 6) return false;
	if (code.length === 6) return code.length;

	return '0'.repeat(6 - code.length) + code;
};

module.exports = mongoose.model('Product', productScheme);
