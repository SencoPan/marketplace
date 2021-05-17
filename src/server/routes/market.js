const router = require('express').Router();
const upload = require('multer')();
const Joi = require('@hapi/joi');

const marketController = require('../controllers/market');
const validation = require('../middlewares/validation');
const {authControl} = require('../middlewares/auth');

//crud

router.get('/list', async (req, res) => {
	await marketController.list(req, res);
}); // @todo add query validation

router.get('/image', async (req, res) => {
	await marketController.image(req, res);
});

router.post('/update', authControl, upload.any(), validation(Joi.object({
	name       : Joi.string().required(),
	price      : Joi.number().required(),
	description: Joi.string().required(),
	userId     : Joi.string().required(),
	_id        : Joi.string().required(),
	image      : Joi.any()
})), async (req, res) => {
	await marketController.update(req, res);
});

router.post('/delete', authControl, validation(Joi.object({
	userId: Joi.string().required(),
	_id   : Joi.string().required(),
})), async (req, res) => {
	await marketController.deleteProduct(req, res);
});

router.post('/create', authControl, upload.any(), validation(Joi.object({
	name       : Joi.string().required(),
	price      : Joi.number().required(),
	description: Joi.string().required()
})), async (req, res) => {
	if (!req.files || !req.files.length) return res.status(400).end();
	await marketController.create(req, res);
});

module.exports = router;
