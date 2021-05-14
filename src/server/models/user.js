const connection = require('../db/mongodb');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
	login       : {type: String, required: true,},
	passwordHash: String,
	salt        : String,
	userid      : {type: String, required: true},
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

userScheme.index({userid: 1, login: 1}, {unique: true});

userScheme.virtual('password')
          .set(function (password) {
	          this._plainPassword = password;
	          if (password) {
		          this.salt = crypto.randomBytes(128).toString('base64');
		          this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
	          } else {
		          this.salt = undefined;
		          this.passwordHash = undefined;
	          }
          })
          .get(function () {
	          return this._plainPassword;
          });

userScheme.methods.checkPassword = function (password) {
	if (!password) return false;
	if (!this.passwordHash) return false;
	return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') === this.passwordHash;
};

userScheme.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
	user.tokens = user.tokens.concat({token});
	await user.save();
	return token;
};

module.exports = mongoose.model('User', userScheme);
