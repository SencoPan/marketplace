const {JWT} = require('../../../config/server');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
	login       : {type: String, required: true,},
	passwordHash: String,
	salt        : String,
	tokens      : [{
		token: {
			type    : String,
			required: true
		}
	}],
	meta        : {type: Schema.Types.Mixed, default: {}}
}, {
	timestamps: true
});

userScheme.index({login: 1}, {unique: true});

userScheme.virtual('password')
          .set(function (password) {
	          if (!password) return;

	          this._plainPassword = password;

	          this.salt = crypto.randomBytes(128).toString('base64');
	          this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
          })
          .get(function () {
	          return this._plainPassword;
          });

userScheme.methods.checkPassword = function (password) {
	if (!password || !this.passwordHash) return false;
	return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

userScheme.methods.generateAuthToken = async function (User) {
	const user = this;
	const token = jwt.sign({_id: user._id}, JWT.key);
	await User.updateOne({
		_id: user._id,
	}, {
		$push: {tokens: {token}}
	});
	return token;
};

module.exports = mongoose.model('User', userScheme);
