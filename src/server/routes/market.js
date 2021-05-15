const router = require('express').Router();

router.get('/list', (req, res) => {
	res.send(200).json({status: 'ok'});
});

module.exports = router;
