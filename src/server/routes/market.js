const router = require('express').Router();
const upload = require('multer')();
const Joi = require('@hapi/joi');

const marketController = require('../controllers/market');
const validation = require('../middlewares/validation');
const {authControl} = require('../middlewares/auth');


router.get('/list', async (req, res) => {
	await marketController.list(req, res);
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
