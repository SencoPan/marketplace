const router = require('express').Router();
const Joi = require('@hapi/joi');
const userController = require('../controllers/user');

const validation = require('../middlewares/validation');
const {authControl} = require('../middlewares/auth');

router.get('/verifyJWT', authControl, async (req, res) => {
	await userController.verifyJWT(req, res);
});

router.post('/reg', validation(Joi.object({
	login   : Joi.string().required(),
	password: Joi.string().required()
})), async (req, res) => {
	await userController.registration(req, res);
});

router.post('/login', validation(Joi.object({
	login   : Joi.string().required(),
	password: Joi.string().required()
})), async (req, res) => {
	await userController.login(req, res);
});

router.post('/logout', authControl, async (req, res) => {
	await userController.logout(req, res);
});

router.post('/logoutAll', authControl, async (req, res) => {
	await userController.logoutAll(req, res);
});

module.exports = router;
